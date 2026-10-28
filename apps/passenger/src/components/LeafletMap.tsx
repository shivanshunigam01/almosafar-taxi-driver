"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Point = { lat: number; lng: number };

export function LeafletMap({
  center,
  pickup,
  dropoff,
  height = 220,
}: {
  center: Point;
  pickup?: Point;
  dropoff?: Point;
  height?: number;
}) {
  const line =
    pickup && dropoff
      ? [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng],
        ] as [number, number][]
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={icon} />}
        {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={icon} />}
        {line && <Polyline positions={line} color="#2563eb" weight={4} />}
      </MapContainer>
    </div>
  );
}
