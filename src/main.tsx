import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ProcedureProvider } from "./context/ProcedureContext";
import { LanguageProvider } from "./context/LanguageContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

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
