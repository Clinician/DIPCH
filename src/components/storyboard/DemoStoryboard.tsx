import React from "react";
import { ProcedureProvider } from "../../context/ProcedureContext";
import Home from "../home";

const DemoStoryboard = () => {
  return (
    <div className="w-full h-full">
      <Home userName="Demo User" />
    </div>
  );
};

export default DemoStoryboard;
