"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { zh } from "./zh";
import { en } from "./en";

export type Language = "zh" | "en";

const dictionaries = { zh, en };

type I18nContextValue = {
  lang: Language;
  setLang: Dispatch<SetStateAction<Language>>;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getText(lang: Language, path: string): string {
  const segments = path.split(".");
  let current: unknown = dictionaries[lang];

  for (const seg of segments) {
    current = (current as Record<string, unknown>)?.[seg];
    if (!current) return path;
  }

  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path: string) => getText(lang, path),
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
