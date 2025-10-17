"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LANGUAGE_COOKIE_NAME,
  defaultLanguage,
  getDictionary,
  isLanguage,
  type Dictionary,
  type Language,
} from "@/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

interface LanguageProviderProps {
  initialLanguage?: Language;
  children: ReactNode;
}

export function LanguageProvider({
  initialLanguage = defaultLanguage,
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    if (!isLanguage(initialLanguage)) {
      setLanguageState(defaultLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState((current) => (current === nextLanguage ? current : nextLanguage));
  }, []);

  const dictionary = useMemo(() => getDictionary(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dictionary,
    }),
    [language, setLanguage, dictionary],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
