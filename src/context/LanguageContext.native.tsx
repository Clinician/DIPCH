import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    "auth.title": "Implant Pass",
    "auth.subtitle": "Secure access to your implant information",
    "auth.pin.title": "PIN Code",
    "auth.faceid.title": "Face ID",
    "auth.faceid.description":
      "Use Face ID to quickly and securely access your implant information.",
    "auth.faceid.button": "Authenticate with Face ID",
    "auth.faceid.authenticating": "Authenticating...",
    "auth.pin.setup.title": "Set Up PIN",
    "auth.pin.setup.description":
      "Create a 6-digit PIN to secure your implant data",
    "auth.pin.setup.button": "Set PIN",
    "auth.pin.setup.cancel": "Cancel",
    "auth.pin.entry.title": "Enter PIN",
    "auth.pin.entry.button": "Unlock",
    "auth.pin.entry.forgot": "Forgot PIN?",
    "auth.pin.stored":
      "Your PIN is stored securely on your device and is never shared.",
    "auth.pin.incorrect": "Incorrect PIN",
    "auth.pin.attempts": "attempts remaining.",
    "auth.pin.locked": "Account Temporarily Locked",
    "auth.pin.locked.description":
      "Too many failed attempts. Please try again in 30 seconds.",
    "auth.pin.enter.description": "Please enter your 6-digit PIN code",
    "auth.pin.locked.message": "Account temporarily locked",
    "auth.pin.locked.timer": "Please try again in {seconds} seconds",
    "auth.pin.change": "Change PIN Code",
    "auth.pin.success": "PIN successfully created!",
    "auth.pin.return": "Return to Settings",
    "auth.pin.min": "PIN must be at least 4 digits",
    "auth.pin.match": "PINs do not match",

    // Dashboard
    "dashboard.title": "Implant Pass",
    "dashboard.welcome": "Welcome",
    "dashboard.recent": "Recent Procedures",
    "dashboard.viewAll": "View All",
    "dashboard.noProcedures": "No procedures found. Add your first procedure.",
    "dashboard.implants": "implant",
    "dashboard.implants_plural": "implants",
    "dashboard.addNew": "Add New",
    "dashboard.allRecords": "All Records",
    "dashboard.exportGuide": "Export Guide",
    "dashboard.settings": "Settings",

    // ... other translations
  },
  de: {
    // Auth
    "auth.title": "Implantat-Pass",
    "auth.subtitle": "Sicherer Zugriff auf Ihre Implantatinformationen",
    "auth.pin.title": "PIN-Code",
    "auth.faceid.title": "Face ID",
    "auth.faceid.description":
      "Verwenden Sie Face ID, um schnell und sicher auf Ihre Implantatinformationen zuzugreifen.",
    "auth.faceid.button": "Mit Face ID authentifizieren",
    "auth.faceid.authenticating": "Authentifizierung...",
    "auth.pin.setup.title": "PIN einrichten",
    "auth.pin.setup.description":
      "Erstellen Sie eine 6-stellige PIN, um Ihre Implantatdaten zu sichern",
    "auth.pin.setup.button": "PIN festlegen",
    "auth.pin.setup.cancel": "Abbrechen",
    "auth.pin.entry.title": "PIN eingeben",
    "auth.pin.entry.button": "Entsperren",
    "auth.pin.entry.forgot": "PIN vergessen?",
    "auth.pin.stored":
      "Ihre PIN wird sicher auf Ihrem Gerät gespeichert und niemals weitergegeben.",
    "auth.pin.incorrect": "Falsche PIN",
    "auth.pin.attempts": "Versuche übrig.",
    "auth.pin.locked": "Konto vorübergehend gesperrt",
    "auth.pin.locked.description":
      "Zu viele fehlgeschlagene Versuche. Bitte versuchen Sie es in 30 Sekunden erneut.",
    "auth.pin.enter.description":
      "Bitte geben Sie Ihren 6-stelligen PIN-Code ein",
    "auth.pin.locked.message": "Konto vorübergehend gesperrt",
    "auth.pin.locked.timer":
      "Bitte versuchen Sie es in {seconds} Sekunden erneut",
    "auth.pin.change": "PIN-Code ändern",
    "auth.pin.success": "PIN erfolgreich erstellt!",
    "auth.pin.return": "Zurück zu Einstellungen",
    "auth.pin.min": "PIN muss mindestens 4 Ziffern haben",
    "auth.pin.match": "PINs stimmen nicht überein",

    // Dashboard
    "dashboard.title": "Implantat-Pass",
    "dashboard.welcome": "Willkommen",
    "dashboard.recent": "Aktuelle Eingriffe",
    "dashboard.viewAll": "Alle anzeigen",
    "dashboard.noProcedures":
      "Keine Eingriffe gefunden. Fügen Sie Ihren ersten Eingriff hinzu.",
    "dashboard.implants": "Implantat",
    "dashboard.implants_plural": "Implantate",
    "dashboard.addNew": "Neu hinzufügen",
    "dashboard.allRecords": "Alle Einträge",
    "dashboard.exportGuide": "Export-Anleitung",
    "dashboard.settings": "Einstellungen",

    // ... other translations
  },
};

const LanguageContext = createContext<LanguageContextType>(
  {} as LanguageContextType,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from AsyncStorage on initial render
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = (await AsyncStorage.getItem(
          "language",
        )) as Language;
        if (
          savedLanguage &&
          (savedLanguage === "en" || savedLanguage === "de")
        ) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language preference:", error);
      }
    };

    loadLanguage();
  }, []);

  // Save language preference to AsyncStorage when it changes
  useEffect(() => {
    const saveLanguage = async () => {
      try {
        await AsyncStorage.setItem("language", language);
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    };

    saveLanguage();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translationSet = translations[language];
    return translationSet[key] || key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export { LanguageContext };
