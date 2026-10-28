"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ar";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (en: string, ar: string) => string;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("almosafar.passenger.locale") as Locale | null;
    if (saved === "en" || saved === "ar") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("almosafar.passenger.locale", locale);
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);
  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const c = useContext(LocaleContext);
  if (!c) throw new Error("LocaleProvider required");
  return c;
}
