import React, { useState, useEffect } from "react";
import AuthScreen from "./auth/AuthScreen";
import Dashboard from "./dashboard/Dashboard";
import { ProcedureProvider } from "../context/ProcedureContext";

interface HomeProps {
  userName?: string;
}

const Home: React.FC<HomeProps> = ({ userName = "Patient" }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  // Check if this is the first time the user is using the app
  useEffect(() => {
    // In a real app, you would check local storage or secure storage
    // to determine if this is a first-time user
    const checkFirstTimeUser = () => {
      // Simulate checking if PIN has been set up before
      const hasPINSetup = localStorage.getItem("pinSetup");
      setIsFirstTimeUser(!hasPINSetup);
    };

    checkFirstTimeUser();

    // For demo purposes, we'll set authentication to true after a delay
    // This ensures we stay on the dashboard after authentication
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Make sure we stay authenticated
        localStorage.setItem("authenticated", "true");
      }
    }, 500);

    // Check if we were previously authenticated
    const wasAuthenticated = localStorage.getItem("authenticated") === "true";
    if (wasAuthenticated) {
      setIsAuthenticated(true);
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);

    // In a real app, you would mark that the user has completed setup
    if (isFirstTimeUser) {
      localStorage.setItem("pinSetup", "true");
      setIsFirstTimeUser(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AuthScreen
          onAuthenticated={handleAuthenticated}
          isFirstTimeUser={isFirstTimeUser}
        />
      ) : (
        <ProcedureProvider>
          <Dashboard userName={userName} onLogout={handleLogout} />
        </ProcedureProvider>
      )}
    </div>
  );
};

export default Home;
