"use client";

import dynamic from "next/dynamic";
const MapInner = dynamic(
  () =>
    import("./AdminLiveMapInner").then((m) => m.AdminLiveMapInner),
  { ssr: false, loading: () => <div className="admin-map-skeleton" /> }
);

export function AdminLiveMap() {
  const center = { lat: 33.3152, lng: 44.3661 };
  return (
    <div className="admin-live-map">
      <h2 className="admin-panel-title">Live map · Baghdad</h2>
      <p className="admin-panel-sub">Demo pins — not real fleet telemetry</p>
      <MapInner center={center} />
    </div>
  );
}
