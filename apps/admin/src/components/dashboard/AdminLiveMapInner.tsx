"use client";

import { MapProvider, MapView, NearbyDriverMarker } from "@almosafar/maps/react";

export function AdminLiveMapInner({ center }: { center: { lat: number; lng: number } }) {
  const drivers = [
    { lat: center.lat + 0.01, lng: center.lng - 0.008 },
    { lat: center.lat - 0.012, lng: center.lng + 0.006 },
    { lat: center.lat + 0.005, lng: center.lng + 0.015 },
  ];
  return (
    <MapProvider>
      <div className="admin-map-frame">
        <MapView center={center} zoom={12}>
          {drivers.map((d, i) => (
            <NearbyDriverMarker key={i} position={d} />
          ))}
        </MapView>
      </div>
    </MapProvider>
  );
}
