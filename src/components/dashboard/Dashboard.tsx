import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProcedures } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import { Shield, Info, LogOut, Globe } from "lucide-react";
import ProcedureOverview from "./ProcedureOverview";
import QRScanner from "../scanner/QRScanner";
import ProcedureList from "../procedures/ProcedureList";
import ProcedureForm from "../procedures/ProcedureForm";
import SettingsScreen from "../settings/SettingsScreen";
import { loadSampleData } from "@/lib/sample-data";
import { getAllProcedures } from "@/lib/db";
import { LanguageSwitcher } from "../ui/language-switcher";

interface ProcedureData {
  id?: string;
  date?: string;
  surgeon?: string;
  hospital?: string;
  procedureType?: string;
  notes?: string;
  implants?: ImplantData[];
}

interface ImplantData {
  id?: string;
  name?: string;
  manufacturer?: string;
  serialNumber?: string;
  type?: string;
  location?: string;
  notes?: string;
}

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "Patient",
  onLogout = () => {},
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { procedures, addProcedure, deleteProcedure } = useProcedures();
  const [activeView, setActiveView] = useState<
    "home" | "scan" | "list" | "form" | "settings"
  >("home");
  const [scannerOpen, setScannerOpen] = useState(false);
  // Local state for active view
  const [localProcedures, setLocalProcedures] = useState<ProcedureData[]>([]);

  // Sync with context
  useEffect(() => {
    setLocalProcedures(procedures);
  }, [procedures]);

  // Load sample data if no procedures exist
  useEffect(() => {
    const checkAndLoadSampleData = async () => {
      try {
        const existingProcedures = await getAllProcedures();
        if (existingProcedures.length === 0) {
          await loadSampleData();
        }
      } catch (error) {
        console.error("Error checking/loading sample data:", error);
      }
    };

    checkAndLoadSampleData();
  }, []);

  const handleScanQR = () => {
    setScannerOpen(true);
    setActiveView("scan");
  };

  const handleViewProcedures = () => {
    setActiveView("list");
  };

  const handleSettings = () => {
    setActiveView("settings");
  };

  const handleScanComplete = (data: ProcedureData) => {
    // Add the scanned procedure to the context
    addProcedure({ ...data, id: `proc-${Date.now()}` });
    setScannerOpen(false);
    setActiveView("home"); // Return to home after scanning
  };

  const handleSaveProcedure = (data: ProcedureData) => {
    // Add the manually entered procedure to the context
    addProcedure({ ...data, id: `proc-${Date.now()}` });
    setActiveView("home"); // Return to home after saving
  };

  const handleDeleteProcedure = (id: string) => {
    // Remove the procedure from the context
    deleteProcedure(id);
  };

  const handleViewProcedure = (id: string) => {
    navigate(`/procedure/${id}`);
  };

  const handleExportProcedure = (id: string) => {
    navigate(`/export/${id}`);
  };

  const handleManualEntry = () => {
    setActiveView("form");
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img
                src="/swiss-cross-logo.png"
                alt="Implant Pass Logo"
                className="h-8 w-8 mr-2"
                onError={(e) => {
                  // Fallback to inline SVG if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNNiA2TDEyIDEyTTE4IDZMMTIgMTJNNiAxOEwxMiAxMk0xOCAxOEwxMiAxMiIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIGZpbGw9IiNGRkQ3MDAiLz48L3N2Zz4=";
                }}
              />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                {t("dashboard.title")}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {t("dashboard.welcome")}, {userName}
              </div>
              <LanguageSwitcher variant="icon" />
              <button
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Logout"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "home" && (
          <ProcedureOverview
            onScanQR={handleScanQR}
            onViewProcedures={handleViewProcedures}
            onManualEntry={handleManualEntry}
            onSettings={handleSettings}
          />
        )}

        {activeView === "scan" && (
          <QRScanner
            isOpen={scannerOpen}
            onClose={() => {
              setScannerOpen(false);
              setActiveView("home");
            }}
            onScanComplete={handleScanComplete}
          />
        )}

        {activeView === "list" && (
          <ProcedureList
            procedures={localProcedures}
            onViewProcedure={handleViewProcedure}
            onExportProcedure={handleExportProcedure}
            onDeleteProcedure={handleDeleteProcedure}
            onAddProcedure={handleManualEntry}
            onBack={() => setActiveView("home")}
          />
        )}

        {activeView === "form" && (
          <ProcedureForm
            onSave={handleSaveProcedure}
            onCancel={() => setActiveView("home")}
          />
        )}

        {activeView === "settings" && (
          <SettingsScreen onBack={() => setActiveView("home")} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            {t("footer.copyright")} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
