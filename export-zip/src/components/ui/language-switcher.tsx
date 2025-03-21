import React from "react";
import { Button } from "./button";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "icon" | "text" | "full";
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "full",
  className = "",
}) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className={className}
        title={language === "en" ? "Switch to German" : "Zu Englisch wechseln"}
      >
        <Globe className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === "text") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className={className}
      >
        {language === "en" ? "DE" : "EN"}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 ${className}`}
    >
      <Globe className="h-4 w-4" />
      {language === "en"
        ? t("settings.language.german")
        : t("settings.language.english")}
    </Button>
  );
};

export { LanguageSwitcher };
