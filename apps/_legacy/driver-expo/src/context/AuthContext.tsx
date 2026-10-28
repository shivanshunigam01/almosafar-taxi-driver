import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Driver } from "@almosafar/shared";
import { useDataService } from "./DataServiceContext";

const SESSION_KEY = "@almosafar/driver_session";

interface AuthContextValue {
  driver: Driver | null;
  loading: boolean;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setOnline: (online: boolean) => Promise<void>;
  refreshOnline: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { service } = useDataService();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  const refreshOnline = useCallback(async () => {
    if (!driver) {
      setIsOnline(false);
      return;
    }
    const online = await service.isDriverOnline(driver.id);
    setIsOnline(online);
  }, [driver, service]);

  const refreshSession = useCallback(async () => {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) {
      setDriver(null);
      setIsOnline(false);
      return;
    }
    const { driverId } = JSON.parse(raw) as { driverId: string };
    const d = await service.getDriver(driverId);
    setDriver(d);
    if (d) {
      const online = await service.isDriverOnline(d.id);
      setIsOnline(online);
    }
  }, [service]);

  useEffect(() => {
    (async () => {
      await refreshSession();
      setLoading(false);
    })();
  }, [refreshSession]);

  const persistSession = async (d: Driver) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ driverId: d.id }));
    setDriver(d);
    const online = await service.isDriverOnline(d.id);
    setIsOnline(online);
  };

  const login = async (email: string, password: string) => {
    if (!email.trim()) throw new Error("Enter a demo driver email.");
    if (service.cloudAuth) {
      const session = await service.cloudAuth.signIn(email, password);
      const d = await service.getDriver(session.entityId);
      if (!d) throw new Error("Driver profile not found in Firestore. Run Firebase seed.");
      await persistSession(d);
      return;
    }
    const d = await service.loginDemoDriver(email.trim());
    if (!d) throw new Error("Demo driver not found.");
    await persistSession(d);
  };

  const logout = async () => {
    if (driver && isOnline) {
      await service.setDriverOnline(driver.id, false);
    }
    if (service.cloudAuth) await service.cloudAuth.signOut();
    await AsyncStorage.removeItem(SESSION_KEY);
    setDriver(null);
    setIsOnline(false);
  };

  const setOnline = async (online: boolean) => {
    if (!driver) return;
    await service.setDriverOnline(driver.id, online);
    setIsOnline(online);
    const refreshed = await service.getDriver(driver.id);
    if (refreshed) setDriver(refreshed);
  };

  const value = useMemo(
    () => ({
      driver,
      loading,
      isOnline,
      login,
      logout,
      refreshSession,
      setOnline,
      refreshOnline,
    }),
    [driver, loading, isOnline, refreshSession, refreshOnline]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
