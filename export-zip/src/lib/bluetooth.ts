// Bluetooth scanner integration for implant data

type ScanCallback = (data: string) => void;

interface BluetoothScannerDevice {
  device: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
  characteristic?: BluetoothRemoteGATTCharacteristic;
}

let connectedDevice: BluetoothScannerDevice | null = null;
let onDataCallback: ScanCallback | null = null;

// Check if Web Bluetooth API is available
export function isBluetoothAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

// Request Bluetooth device and connect to it
export async function connectBluetoothScanner(
  onData: ScanCallback,
): Promise<BluetoothScannerDevice | null> {
  try {
    if (!isBluetoothAvailable()) {
      throw new Error("Bluetooth is not available on this device or browser");
    }

    // If already connected, disconnect first to ensure clean state
    if (isBluetoothConnected()) {
      await disconnectBluetoothScanner();
    }

    // Assume scanner is already connected to the device
    // Skip the device selection dialog and use keyboard events instead
    console.log("Using keyboard events for scanner input");

    // Create a virtual device object
    const device = {
      name: "Connected Scanner",
      gatt: null,
    } as BluetoothDevice;

    console.log("Using already connected scanner device");

    // Skip GATT connection and use keyboard events instead
    // Set up a global keyboard event listener to capture scanner input
    scanBuffer = "";
    let scanTimeout: number | null = null;

    // Remove any existing event listener first
    if (keydownEventHandler) {
      window.removeEventListener("keydown", keydownEventHandler);
      keydownEventHandler = null;
    }

    // Create a new event handler
    keydownEventHandler = (event: KeyboardEvent) => {
      // Most barcode scanners send a return/enter key after scanning
      if (event.key === "Enter") {
        // Always prevent default for Enter to avoid form submissions
        event.preventDefault();

        if (scanBuffer.length > 0) {
          // Process the complete scan
          const trimmedData = scanBuffer.trim();
          console.log("Scan complete:", trimmedData);

          // Call the callback directly
          onData(trimmedData);

          // Dispatch a custom event that other components can listen for
          const scanEvent = new CustomEvent("bluetooth-scanner-data", {
            detail: trimmedData,
          });
          window.dispatchEvent(scanEvent);

          // Clear the buffer after processing
          scanBuffer = "";

          // Return focus to the scanner dialog to prepare for next scan
          const scannerDialog = document.querySelector('[role="dialog"]');
          if (scannerDialog) {
            const focusableElement = scannerDialog.querySelector("button");
            if (focusableElement) {
              (focusableElement as HTMLElement).focus();
            }
          }
        }
      } else if (event.key.length === 1) {
        // Only capture printable characters
        // Add character to buffer
        scanBuffer += event.key;

        // Reset timeout - scanners typically send characters rapidly
        if (scanTimeout) {
          window.clearTimeout(scanTimeout);
        }

        // Set timeout to process scan if no more characters received
        scanTimeout = window.setTimeout(() => {
          if (scanBuffer.length > 0) {
            console.log("Scan timeout complete:", scanBuffer);
            onData(scanBuffer.trim());

            // Dispatch a custom event that other components can listen for
            const scanEvent = new CustomEvent("bluetooth-scanner-data", {
              detail: scanBuffer.trim(),
            });
            window.dispatchEvent(scanEvent);

            scanBuffer = "";
          }
        }, 100); // 100ms timeout
      }
    };

    // Add the event listener
    window.addEventListener("keydown", keydownEventHandler);

    // Store the connected device and callback
    connectedDevice = { device };
    onDataCallback = onData;

    console.log("Scanner input handler connected successfully");
    return connectedDevice;
  } catch (error) {
    console.error("Error connecting to Bluetooth scanner:", error);
    return null;
  }
}

// Store the actual event handler reference so we can remove it properly
let keydownEventHandler: ((event: KeyboardEvent) => void) | null = null;
// Global scan buffer to maintain state between events
let scanBuffer = "";

// Disconnect from Bluetooth device
export async function disconnectBluetoothScanner(): Promise<void> {
  try {
    // Remove keyboard event listener if it exists
    if (keydownEventHandler) {
      window.removeEventListener("keydown", keydownEventHandler);
      keydownEventHandler = null;
      console.log("Removed keyboard event listener");
    }

    connectedDevice = null;
    onDataCallback = null;
    console.log("Scanner input handler disconnected");
  } catch (error) {
    console.error("Error disconnecting scanner input handler:", error);
  }
}

// Check if a scanner is currently connected
export function isBluetoothConnected(): boolean {
  return !!connectedDevice;
}

// Get the name of the connected device
export function getConnectedDeviceName(): string | null {
  return connectedDevice?.device?.name || null;
}

// Mock function for environments where Bluetooth is not available
export function useSampleBluetoothData(scanTarget: string): string {
  if (scanTarget === "articleNumber") {
    return (
      "ART-" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")
    );
  } else {
    return (
      "LOT-" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")
    );
  }
}
