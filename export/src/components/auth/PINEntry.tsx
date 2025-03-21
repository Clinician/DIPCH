import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PINEntryProps {
  onPINSubmit?: (pin: string) => void;
  maxAttempts?: number;
  isAuthenticated?: boolean;
}

const PINEntry: React.FC<PINEntryProps> = ({
  onPINSubmit = () => {},
  maxAttempts = 3,
  isAuthenticated = false,
}) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const { toast } = useToast();

  // Handle number input
  const handleNumberPress = (num: number) => {
    if (pin.length < 6 && !isLocked) {
      const newPin = (prev) => prev + num.toString();
      setPin(newPin);
      console.log(`PIN updated: length ${pin.length + 1}`);
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (pin.length > 0 && !isLocked) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  // Handle PIN submission
  const handleSubmit = () => {
    if (pin.length === 6 && !isLocked) {
      onPINSubmit(pin);

      // For demo purposes, we'll simulate authentication failure
      // In a real app, this would be handled by the parent component
      if (!isAuthenticated) {
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= maxAttempts) {
          setIsLocked(true);
          setLockoutTimer(30); // 30 second lockout
          toast({
            title: "Account Temporarily Locked",
            description:
              "Too many failed attempts. Please try again in 30 seconds.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Incorrect PIN",
            description: `${maxAttempts - attempts - 1} attempts remaining.`,
            variant: "destructive",
          });
        }
        setPin("");
      }
    }
  };

  // Handle lockout timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  // Create the PIN display dots
  const renderPINDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full ${i < pin.length ? "bg-primary" : "bg-gray-300"}`}
          aria-label={i < pin.length ? "Filled PIN digit" : "Empty PIN digit"}
        />,
      );
    }
    return dots;
  };

  // Create the numeric keypad
  const renderKeypad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "backspace"];
    return numbers.map((num, index) => {
      if (num === null) {
        return <div key={index} className="w-16 h-16" />;
      }

      if (num === "backspace") {
        return (
          <Button
            key={index}
            variant="ghost"
            className="w-16 h-16 text-2xl flex items-center justify-center rounded-full"
            onClick={handleBackspace}
            disabled={isLocked}
          >
            ←
          </Button>
        );
      }

      return (
        <Button
          key={index}
          variant="ghost"
          className="w-16 h-16 text-2xl flex items-center justify-center rounded-full"
          onClick={() => handleNumberPress(num as number)}
          disabled={isLocked}
        >
          {num}
        </Button>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("auth.pin.entry.title")}</h2>

      {isLocked ? (
        <div className="text-center mb-6 text-red-500">
          <p>Account temporarily locked</p>
          <p>Please try again in {lockoutTimer} seconds</p>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">Please enter your 6-digit PIN code</p>
      )}

      <div className="flex space-x-3 mb-8">{renderPINDots()}</div>

      <div className="grid grid-cols-3 gap-4 mb-6">{renderKeypad()}</div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={pin.length !== 6 || isLocked}
      >
        {t("auth.pin.entry.button")}
      </Button>
    </div>
  );
};

export default PINEntry;
