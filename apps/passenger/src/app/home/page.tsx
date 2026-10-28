"use client";

import dynamic from "next/dynamic";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";

const MapHomeClient = dynamic(
  () => import("@/components/MapHomeClient").then((m) => m.MapHomeClient),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton flex h-[calc(100dvh-6rem)] items-center justify-center text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

export default function PassengerDashboard() {
  return (
    <MapErrorBoundary>
      <MapHomeClient />
    </MapErrorBoundary>
  );
}