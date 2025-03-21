import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./home";
import ProcedureDetail from "./procedures/ProcedureDetail";
import ProcedureForm from "./procedures/ProcedureForm";
import ExportOptions from "./export/ExportOptions";
import ExportGuide from "./export/ExportGuide";
import SettingsScreen from "./settings/SettingsScreen";
import PINSetup from "./auth/PINSetup";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/procedure/:id" element={<ProcedureDetail />} />
      <Route path="/procedure/new" element={<ProcedureForm />} />
      <Route path="/procedure/edit/:id" element={<ProcedureForm />} />
      <Route path="/export/:id" element={<ExportOptions />} />
      <Route path="/export-guide" element={<ExportGuide />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/pin-setup" element={<PINSetup />} />
    </Routes>
  );
};

export default AppRouter;
