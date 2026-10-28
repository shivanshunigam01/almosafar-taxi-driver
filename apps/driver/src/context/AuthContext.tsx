"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getDemoSeedBundle } from "@almosafar/shared";

const KEY = "almosafar.driver.session";

type Session = { driverId: string; name: string; email: string; vehicleId: string };

const AuthContext = createContext<{
  session: Session | null;
  hydrated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setSession(JSON.parse(raw));
    setHydrated(true);
  }, []);

  const login = async (email: string) => {
    const seed = getDemoSeedBundle();
    const d =
      seed.drivers.find(
        (x) => (x.email ?? "").toLowerCase() === email.trim().toLowerCase()
      ) ?? seed.drivers[0]!;
    const vehicle = seed.vehicles.find((v) => v.driverId === d.id) ?? seed.vehicles[0]!;
    const s = {
      driverId: d.id,
      name: d.displayName,
      email: d.email ?? email.trim(),
      vehicleId: vehicle.id,
    };
    setSession(s);
    localStorage.setItem(KEY, JSON.stringify(s));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        hydrated,
        login,
        logout: () => {
          setSession(null);
          localStorage.removeItem(KEY);
        },
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
