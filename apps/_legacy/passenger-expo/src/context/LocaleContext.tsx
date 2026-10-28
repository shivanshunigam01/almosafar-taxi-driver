import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18nManager } from "react-native";
import { en, type TranslationKey } from "../i18n/en";
import { ar } from "../i18n/ar";

const LOCALE_KEY = "@almosafar/locale";

export type AppLocale = "en" | "ar";

interface LocaleContextValue {
  locale: AppLocale;
  isRtl: boolean;
  t: (key: TranslationKey) => string;
  setLocale: (locale: AppLocale) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

async function applyRtl(locale: AppLocale): Promise<void> {
  const rtl = locale === "ar";
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
  }
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(LOCALE_KEY);
      const next: AppLocale = stored === "ar" ? "ar" : "en";
      await applyRtl(next);
      setLocaleState(next);
      setReady(true);
    })();
  }, []);

  const setLocale = useCallback(async (next: AppLocale) => {
    await AsyncStorage.setItem(LOCALE_KEY, next);
    await applyRtl(next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => (locale === "ar" ? ar[key] : en[key]),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      isRtl: locale === "ar",
      t,
      setLocale,
    }),
    [locale, t, setLocale]
  );

  if (!ready) return null;

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale requires LocaleProvider");
  return ctx;
}
