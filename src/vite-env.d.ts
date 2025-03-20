/// <reference types="vite/client" />

// Add custom event type for Bluetooth scanner
interface WindowEventMap {
  "bluetooth-scanner-data": CustomEvent<string>;
}
