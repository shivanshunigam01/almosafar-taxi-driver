import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CloudConnectionError,
  createAlmosafarDataServiceAsync,
  resetAlmosafarDataServiceForTests,
  type AlmosafarDataService,
} from "@almosafar/shared";
import { View, Text, ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../components/PrimaryButton";
import { useLocale } from "./LocaleContext";

const env = {
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  NODE_ENV: process.env.NODE_ENV,
};

const DataServiceContext = createContext<{
  service: AlmosafarDataService;
} | null>(null);

export function DataServiceProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const [service, setService] = useState<AlmosafarDataService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceLocal, setForceLocal] = useState(false);

  const init = useCallback(async (localOnly: boolean) => {
    setLoading(true);
    setError(null);
    try {
      if (localOnly) resetAlmosafarDataServiceForTests();
      const svc = await createAlmosafarDataServiceAsync(env, {
        forceLocal: localOnly,
      });
      setService(svc);
    } catch (e) {
      if (e instanceof CloudConnectionError) {
        setError(e.message);
        setService(null);
      } else {
        setError(e instanceof Error ? e.message : "Failed to initialize data service");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init(forceLocal);
  }, [init, forceLocal]);

  const value = useMemo(() => (service ? { service } : null), [service]);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  if (error && !service) {
    return (
      <View style={tw`flex-1 p-6 justify-center bg-white`}>
        <Text style={tw`text-xl font-bold text-red-700`}>{t("connectionError")}</Text>
        <Text style={tw`text-sm text-gray-700 mt-3`}>{t("connectionErrorHint")}</Text>
        <Text style={tw`text-xs text-gray-500 mt-2`}>{error}</Text>
        <View style={tw`mt-6`}>
          <PrimaryButton label={t("retry")} onPress={() => init(forceLocal)} />
        </View>
        <View style={tw`mt-3`}>
          <PrimaryButton
            label={t("useLocalDemo")}
            variant="secondary"
            onPress={() => setForceLocal(true)}
          />
        </View>
      </View>
    );
  }

  if (!value) return null;

  return (
    <DataServiceContext.Provider value={value}>{children}</DataServiceContext.Provider>
  );
}

export function useDataService(): { service: AlmosafarDataService } {
  const ctx = useContext(DataServiceContext);
  if (!ctx) throw new Error("useDataService requires DataServiceProvider");
  return ctx;
}
