import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Shield, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

interface PINSetupProps {
  onComplete?: (pin: string) => void;
  onCancel?: () => void;
  onReturnToSettings?: () => void;
}

const PINSetup = ({
  onComplete = () => {},
  onCancel = () => {},
  onReturnToSettings = () => {},
}: PINSetupProps) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnToSettings = location.state?.returnToSettings;

  // Reset error when inputs change
  useEffect(() => {
    if (error) setError("");
  }, [pin, confirmPin]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setConfirmPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate PIN
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    // Show success state briefly before completing
    setSuccess(true);
    setTimeout(() => {
      onComplete(pin);
    }, 1000);
  };

  const handleReturn = () => {
    if (returnToSettings) {
      navigate("/settings");
    } else {
      onReturnToSettings();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-background">
      <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{t("auth.pin.setup.title")}</h2>
          <p className="text-muted-foreground">
            {t("auth.pin.setup.description")}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center space-y-4 py-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-lg font-medium">PIN successfully created!</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleReturn}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Settings
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium">
                Enter PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-6 digit PIN"
                value={pin}
                onChange={handlePinChange}
                className="text-center text-lg"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPin" className="text-sm font-medium">
                Confirm PIN
              </label>
              <Input
                id="confirmPin"
                type="password"
                placeholder="Confirm your PIN"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                className="text-center text-lg"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-center p-3 space-x-2 text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex flex-col space-y-2 pt-2">
              <Button type="submit" disabled={!pin || !confirmPin}>
                {t("auth.pin.setup.button")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReturn}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.pin.setup.cancel")}
              </Button>
            </div>
          </form>
        )}

        <div className="text-xs text-center text-muted-foreground">
          Your PIN is stored securely on your device and is never shared.
        </div>
      </div>
    </div>
  );
};

export default PINSetup;
