"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { LatLng } from "../types";
import { useMapServices } from "./MapProvider";

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) {
      if (points[0]) map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [48, 48], maxZoom: 15 }
    );
  }, [map, points]);
  return null;
}

export function MapView({
  center,
  zoom,
  className,
  fitPoints,
  children,
  scrollWheelZoom = true,
}: {
  center?: LatLng;
  zoom?: number;
  className?: string;
  fitPoints?: LatLng[];
  children?: React.ReactNode;
  scrollWheelZoom?: boolean;
}) {
  const { config } = useMapServices();
  const c = center ?? config.defaultCenter;
  const z = zoom ?? config.defaultZoom;

  return (
    <div className={className ?? "h-full w-full"}>
      <MapContainer
        center={[c.lat, c.lng]}
        zoom={z}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer attribution={config.tileAttribution} url={config.tileUrl} />
        {fitPoints && fitPoints.length > 0 ? <FitBounds points={fitPoints} /> : null}
        {children}
      </MapContainer>
    </div>
  );
}
