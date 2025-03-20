import { BrowserQRCodeReader, BrowserMultiFormatReader } from "@zxing/browser";

// Initialize QR code reader
let codeReader: BrowserMultiFormatReader | null = null;

// Start QR code scanning
export async function startQRScanner(
  videoElementId: string,
  onResult: (text: string) => void,
  onError: (error: any) => void,
) {
  try {
    if (!codeReader) {
      // Use MultiFormatReader for better compatibility
      codeReader = new BrowserMultiFormatReader();
    }

    const videoElement = document.getElementById(
      videoElementId,
    ) as HTMLVideoElement;
    if (!videoElement) {
      throw new Error(`Video element with ID ${videoElementId} not found`);
    }

    // Check if running on iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Set video attributes required for iOS
    videoElement.setAttribute("playsinline", "true"); // Required for iOS
    videoElement.setAttribute("autoplay", "true");
    videoElement.setAttribute("muted", "true");

    // For iOS, we need to handle permissions and constraints differently
    let stream;
    try {
      // First try with simpler constraints that work better on iOS
      const iosConstraints = {
        audio: false,
        video: {
          facingMode: "environment",
        },
      };

      // Try to get user media with iOS-friendly constraints
      stream = await navigator.mediaDevices.getUserMedia(iosConstraints);
      console.log("Camera access granted with iOS-friendly constraints");
    } catch (initialError) {
      console.warn(
        "Initial camera access failed, trying fallback:",
        initialError,
      );

      try {
        // Fallback to more general constraints
        const fallbackConstraints = {
          audio: false,
          video: true,
        };

        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        console.log("Camera access granted with fallback constraints");
      } catch (fallbackError) {
        console.error("All camera access attempts failed:", fallbackError);
        onError(
          "Camera permission denied. Please allow camera access in your browser settings.",
        );
        return null;
      }
    }

    // Manually attach the stream to the video element
    videoElement.srcObject = stream;

    // Ensure video is playing
    try {
      await videoElement.play();
    } catch (playError) {
      console.error("Video play error:", playError);
      onError("Failed to start video stream. Please try again.");
      return null;
    }

    console.log("Video element is now playing");

    // Start continuous scanning
    const controls = await codeReader.decodeFromVideoElement(
      videoElement,
      (result, error) => {
        if (result) {
          console.log("QR code detected:", result.getText());
          onResult(result.getText());
        }
        if (error && !(error instanceof TypeError)) {
          // Ignore TypeError which is common during scanning
          console.error("Scanning error:", error);
        }
      },
    );

    console.log("QR scanner started successfully");
    // Return controls to stop scanning later
    return controls;
  } catch (error) {
    console.error("QR Scanner initialization error:", error);
    onError(error);
    return null;
  }
}

// Stop QR code scanning
export function stopQRScanner(controls: any) {
  if (controls) {
    console.log("Stopping QR scanner");
    controls.stop();
  }
}

// Clean up resources
export function resetQRScanner() {
  if (codeReader) {
    console.log("Resetting QR scanner");
    codeReader.reset();
    codeReader = null;
  }
}
