import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export const useTranslation = () => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  return { language, setLanguage, t };
};
