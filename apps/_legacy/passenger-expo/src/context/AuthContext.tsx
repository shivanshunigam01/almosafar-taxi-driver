import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Passenger } from "@almosafar/shared";
import { useDataService } from "./DataServiceContext";

const SESSION_KEY = "@almosafar/passenger_session";
const ONBOARDING_KEY = "@almosafar/onboarding_done";

interface AuthContextValue {
  passenger: Passenger | null;
  loading: boolean;
  onboardingComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { service } = useDataService();
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const refreshSession = useCallback(async () => {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) {
      setPassenger(null);
      return;
    }
    const { passengerId } = JSON.parse(raw) as { passengerId: string };
    const p = await service.getPassenger(passengerId);
    setPassenger(p);
  }, [service]);

  useEffect(() => {
    (async () => {
      const onboard = await AsyncStorage.getItem(ONBOARDING_KEY);
      setOnboardingComplete(onboard === "true");
      await refreshSession();
      setLoading(false);
    })();
  }, [refreshSession]);

  const persistSession = async (p: Passenger) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ passengerId: p.id }));
    setPassenger(p);
  };

  const login = async (email: string, password: string) => {
    if (!email.trim()) throw new Error("Enter a demo email address.");
    if (service.cloudAuth) {
      const session = await service.cloudAuth.signIn(email, password);
      const p = await service.getPassenger(session.entityId);
      if (!p) throw new Error("Passenger profile not found in Firestore. Run Firebase seed.");
      await persistSession(p);
      return;
    }
    let p = await service.loginDemoPassenger(email);
    if (!p) {
      p = await service.registerDemoPassenger({
        displayName: email.split("@")[0] ?? "Demo Passenger",
        email: email.trim(),
      });
    }
    await persistSession(p);
  };

  const register = async (name: string, email: string, phone: string) => {
    if (!name.trim() || !email.trim()) throw new Error("Name and email are required.");
    const phoneE164 = phone.startsWith("+") ? phone : `+966${phone.replace(/\D/g, "")}`;
    const p = await service.registerDemoPassenger({
      displayName: name.trim(),
      email: email.trim(),
      phoneE164: phone ? phoneE164 : undefined,
    });
    await persistSession(p);
  };

  const logout = async () => {
    if (service.cloudAuth) await service.cloudAuth.signOut();
    await AsyncStorage.removeItem(SESSION_KEY);
    setPassenger(null);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingComplete(true);
  };

  const value = useMemo(
    () => ({
      passenger,
      loading,
      onboardingComplete,
      login,
      register,
      logout,
      completeOnboarding,
      refreshSession,
    }),
    [passenger, loading, onboardingComplete, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
