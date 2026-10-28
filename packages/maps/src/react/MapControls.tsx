"use client";

import { useMap } from "react-leaflet";
import type { LatLng } from "../types";

export function RecenterControl({
  target,
  className,
}: {
  target: LatLng;
  className?: string;
}) {
  const map = useMap();
  return (
    <button
      type="button"
      aria-label="Recenter map"
      className={
        className ??
        "absolute right-3 bottom-28 z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-black/5"
      }
      onClick={() => map.setView([target.lat, target.lng], Math.max(map.getZoom(), 14))}
    >
      ◎
    </button>
  );
}

export function ZoomControls({ className }: { className?: string }) {
  const map = useMap();
  return (
    <div
      className={
        className ??
        "absolute right-3 bottom-40 z-[1000] flex flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
      }
    >
      <button
        type="button"
        aria-label="Zoom in"
        className="h-10 w-10 text-lg font-bold text-slate-800"
        onClick={() => map.zoomIn()}
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        className="h-10 w-10 border-t border-slate-100 text-lg font-bold text-slate-800"
        onClick={() => map.zoomOut()}
      >
        −
      </button>
    </div>
  );
}
