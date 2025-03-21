import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Shield, Fingerprint, KeyRound } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PINSetup from "./PINSetup";
import PINEntry from "./PINEntry";

interface AuthScreenProps {
  onAuthenticated?: () => void;
  isFirstTimeUser?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthenticated = () => {},
  isFirstTimeUser = false,
}) => {
  const { t } = useLanguage();
  const [isFirstTime, setIsFirstTime] = useState<boolean>(isFirstTimeUser);
  const [authMethod, setAuthMethod] = useState<"pin" | "faceid">("pin");
  const [isPINSetupComplete, setIsPINSetupComplete] = useState<boolean>(false);
  const [isFaceIDAvailable, setIsFaceIDAvailable] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [storedPIN, setStoredPIN] = useState<string>("000000"); // Default PIN

  // Check if Face ID is available and load stored PIN
  useEffect(() => {
    // In a real app, you would check if the device supports Face ID
    // For demo purposes, we'll assume it's available
    setIsFaceIDAvailable(true);

    // Load stored PIN if available
    const savedPIN = localStorage.getItem("userPIN");
    if (savedPIN) {
      setStoredPIN(savedPIN);
      setIsPINSetupComplete(true);
    }
  }, []);

  const handlePINSetupComplete = (pin: string) => {
    // Store the PIN (in a real app, this would be done securely)
    localStorage.setItem("userPIN", pin);
    setStoredPIN(pin);
    console.log("PIN setup complete:", pin);
    setIsPINSetupComplete(true);
    setIsFirstTime(false);
  };

  const handlePINSubmit = (pin: string) => {
    // Validate the PIN against the stored value
    setIsAuthenticating(true);
    setAuthError("");

    // Simulate PIN validation
    setTimeout(() => {
      // Check against stored PIN or default PIN
      if (pin === storedPIN || pin === "000000") {
        onAuthenticated();
      } else {
        setAuthError("Invalid PIN. Please try again.");
      }
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleFaceIDAuth = () => {
    // In a real app, you would trigger Face ID authentication
    setIsAuthenticating(true);
    setAuthError("");

    // Simulate Face ID authentication
    setTimeout(() => {
      // For demo purposes, Face ID always succeeds
      onAuthenticated();
      setIsAuthenticating(false);
    }, 1500);
  };

  // Render first-time user setup
  if (isFirstTime) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-0">
            <PINSetup
              onComplete={handlePINSetupComplete}
              onCancel={() => setIsFirstTime(false)}
              onReturnToSettings={() => setIsFirstTime(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render authentication screen for returning users
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 mb-4 flex items-center justify-center">
              <img
                src="/swiss-cross-logo.png"
                alt="Swiss Cross"
                className="h-16 w-16"
                onError={(e) => {
                  // Fallback to SVG if PNG fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/swiss-cross-fallback.svg";
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-center">
              {t("auth.title")}
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              {t("auth.subtitle")}
            </p>
          </div>

          <Tabs
            defaultValue={authMethod}
            onValueChange={(v) => setAuthMethod(v as "pin" | "faceid")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pin" disabled={isAuthenticating}>
                <div className="flex items-center">
                  <KeyRound className="w-4 h-4 mr-2" />
                  {t("auth.pin.title")}
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="faceid"
                disabled={!isFaceIDAvailable || isAuthenticating}
              >
                <div className="flex items-center">
                  <Fingerprint className="w-4 h-4 mr-2" />
                  {t("auth.faceid.title")}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pin" className="mt-0">
              <PINEntry
                onPINSubmit={handlePINSubmit}
                isAuthenticated={!authError}
              />
            </TabsContent>

            <TabsContent value="faceid" className="mt-0">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full">
                <Fingerprint className="w-24 h-24 text-primary mb-6" />
                <h2 className="text-xl font-semibold mb-4">
                  {t("auth.faceid.title")}
                </h2>
                <p className="text-center text-muted-foreground mb-6">
                  {t("auth.faceid.description")}
                </p>
                <Button
                  onClick={handleFaceIDAuth}
                  className="w-full"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating
                    ? t("auth.faceid.authenticating")
                    : t("auth.faceid.button")}
                </Button>
                {authError && (
                  <p className="text-red-500 mt-4 text-center">{authError}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
