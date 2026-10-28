import type { MapProviderConfig } from "./types";

const DEFAULT_CENTER = { lat: 33.3152, lng: 44.3661 };

export function resolveMapConfig(
  partial?: Partial<MapProviderConfig>
): MapProviderConfig {
  return {
    tileUrl:
      partial?.tileUrl ??
      process.env.NEXT_PUBLIC_MAP_TILE_URL ??
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution:
      partial?.tileAttribution ??
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    osrmBaseUrl:
      partial?.osrmBaseUrl ??
      process.env.NEXT_PUBLIC_OSRM_URL ??
      "https://router.project-osrm.org",
    nominatimBaseUrl:
      partial?.nominatimBaseUrl ??
      process.env.NEXT_PUBLIC_NOMINATIM_URL ??
      "https://nominatim.openstreetmap.org",
    defaultCenter: partial?.defaultCenter ?? DEFAULT_CENTER,
    defaultZoom: partial?.defaultZoom ?? 13,
    searchDebounceMs: partial?.searchDebounceMs ?? 400,
    minSearchIntervalMs: partial?.minSearchIntervalMs ?? 1200,
    userAgent:
      partial?.userAgent ??
      process.env.NEXT_PUBLIC_MAP_USER_AGENT ??
      "AlmosafarTaxiDemo/1.0 (local demo; contact@almosafar.demo)",
  };
}

export const BAGHDAD_BOUNDS = {
  southWest: { lat: 33.15, lng: 44.05 },
  northEast: { lat: 33.45, lng: 44.55 },
};
