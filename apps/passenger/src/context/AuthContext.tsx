"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getDemoSeedBundle } from "@almosafar/shared";

const KEY = "almosafar.passenger.session";

type Session = {
  passengerId: string;
  name: string;
  email: string;
  phone: string;
  onboardingDone: boolean;
};

type AuthCtx = {
  session: Session | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  completeOnboarding: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Session;
        setSession({
          ...parsed,
          phone: parsed.phone ?? "+964 770 000 0000",
        });
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  const persist = (s: Session | null) => {
    setSession(s);
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  };

  const login = async (email: string, _password: string) => {
    const seed = getDemoSeedBundle();
    const p =
      seed.passengers.find(
        (x) => (x.email ?? "").toLowerCase() === email.trim().toLowerCase()
      ) ??
      seed.passengers[0]!;
    persist({
      passengerId: p.id,
      name: p.displayName,
      email: p.email ?? email.trim(),
      phone: p.phoneE164 ?? "+964 770 000 0000",
      onboardingDone: true,
    });
  };

  const register = async (name: string, email: string, phone: string) => {
    persist({
      passengerId: `local_passenger_${Date.now()}`,
      name,
      email,
      phone: phone.trim() || "+964 770 000 0000",
      onboardingDone: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        hydrated,
        login,
        register,
        completeOnboarding: () => {
          localStorage.setItem("almosafar.passenger.onboardingDone", "1");
          if (session) persist({ ...session, onboardingDone: true });
        },
        logout: () => persist(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("AuthProvider required");
  return c;
}
