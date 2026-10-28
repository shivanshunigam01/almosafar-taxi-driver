import type { GeoPoint } from "@almosafar/shared";

export type LatLng = { lat: number; lng: number };

export type MapPlace = {
  label: string;
  geo: GeoPoint;
  source: "gps" | "search" | "map" | "preset" | "saved" | "nominatim";
};

export type RouteSource = "osrm" | "demo_seed" | "straight_line";

export type RouteResult = {
  source: RouteSource;
  distanceKm: number;
  durationMinutes: number;
  /** [lat, lng][] for Leaflet */
  polyline: [number, number][];
  attribution?: string;
  warning?: string;
};

export type GeocodingResult = {
  places: MapPlace[];
  source: "preset" | "nominatim" | "mixed";
};

export type MapProviderConfig = {
  tileUrl: string;
  tileAttribution: string;
  osrmBaseUrl: string;
  nominatimBaseUrl: string;
  defaultCenter: LatLng;
  defaultZoom: number;
  searchDebounceMs: number;
  minSearchIntervalMs: number;
  userAgent: string;
};
