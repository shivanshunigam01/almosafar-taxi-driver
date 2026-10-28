"use client";

import React, { useMemo } from "react";
import { LocalStorageRideRepository } from "@almosafar/demo-core";
import { AuthProvider } from "./AuthContext";
import { RideRepoProvider } from "./RideRepoContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const repo = useMemo(() => new LocalStorageRideRepository("driver"), []);
  return (
    <AuthProvider>
      <RideRepoProvider repo={repo}>{children}</RideRepoProvider>
    </AuthProvider>
  );
}
