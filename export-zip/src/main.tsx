import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ProcedureProvider } from "./context/ProcedureContext";
import { LanguageProvider } from "./context/LanguageContext";
import { initCapacitor } from "./capacitor-app";

// Only initialize Tempo in development environment
if (import.meta.env.DEV) {
  const { TempoDevtools } = await import("tempo-devtools");
  TempoDevtools.init();
}

// Initialize Capacitor when running as a native app
document.addEventListener("DOMContentLoaded", () => {
  initCapacitor();
});

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <LanguageProvider>
        <ProcedureProvider>
          <App />
        </ProcedureProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
