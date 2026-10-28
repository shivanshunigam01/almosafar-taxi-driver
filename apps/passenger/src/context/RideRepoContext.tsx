"use client";

import React, { createContext, useContext } from "react";
import type { LocalStorageRideRepository } from "@almosafar/demo-core";

const Ctx = createContext<LocalStorageRideRepository | null>(null);

export function RideRepoProvider({
  repo,
  children,
}: {
  repo: LocalStorageRideRepository;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={repo}>{children}</Ctx.Provider>;
}

export function useRideRepo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("RideRepoProvider required");
  return v;
}
