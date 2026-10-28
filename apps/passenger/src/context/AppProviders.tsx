"use client";

import React, { useMemo } from "react";
import { LocalStorageRideRepository } from "@almosafar/demo-core";
import { AuthProvider } from "./AuthContext";
import { LocaleProvider } from "./LocaleContext";
import { RideRepoProvider } from "./RideRepoContext";
import { BookingProvider } from "./BookingContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const repo = useMemo(() => new LocalStorageRideRepository("passenger"), []);
  return (
    <LocaleProvider>
      <AuthProvider>
        <RideRepoProvider repo={repo}>
          <BookingProvider>{children}</BookingProvider>
        </RideRepoProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
