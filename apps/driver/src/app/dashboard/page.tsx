"use client";

import dynamic from "next/dynamic";

const DriverMapDashboard = dynamic(
  () => import("@/components/DriverMapDashboard").then((m) => m.DriverMapDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[70dvh] items-center justify-center text-slate-400">Loading map…</div>
    ),
  }
);

export default function DriverDashboard() {
  return <DriverMapDashboard />;
}
