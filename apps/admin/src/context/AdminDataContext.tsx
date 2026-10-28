"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LocalAdminDataService, type AdminDataService } from "@almosafar/shared";

const AdminDataContext = createContext<{
  admin: AdminDataService | null;
  error: string | null;
  loading: boolean;
  forceLocal: boolean;
  setForceLocal: (v: boolean) => void;
  retry: () => void;
} | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const admin = useMemo(() => new LocalAdminDataService(), []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      error: null,
      loading,
      forceLocal: true,
      setForceLocal: () => {},
      retry: () => {},
    }),
    [admin, loading]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("AdminDataProvider required");
  return ctx;
}
