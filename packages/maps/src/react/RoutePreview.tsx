"use client";

import { Polyline } from "react-leaflet";
import type { RouteResult } from "../types";

export function RoutePreviewLayer({ route }: { route: RouteResult | null }) {
  if (!route?.polyline.length) return null;
  const color =
    route.source === "osrm"
      ? "#0d9488"
      : route.source === "demo_seed"
        ? "#0891b2"
        : "#64748b";
  return (
    <Polyline
      positions={route.polyline}
      pathOptions={{ color, weight: 5, opacity: 0.9 }}
    />
  );
}
