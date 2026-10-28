import { DEMO_LOCATIONS } from "@almosafar/shared";
import type { MapProviderConfig } from "../types";
import type { GeocodingResult, MapPlace } from "../types";
import { createRateLimiter, debounce } from "./throttle";

const searchCache = new Map<string, GeocodingResult>();

function filterPresets(query: string): MapPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return DEMO_LOCATIONS.slice(0, 6).map((a) => ({
      label: a.label,
      geo: a.geo,
      source: "preset" as const,
    }));
  }
  return DEMO_LOCATIONS.filter((a) => a.label.toLowerCase().includes(q)).map(
    (a) => ({
      label: a.label,
      geo: a.geo,
      source: "preset" as const,
    })
  );
}

export class GeocodingService {
  private limiter;

  constructor(private config: MapProviderConfig) {
    this.limiter = createRateLimiter(config.minSearchIntervalMs);
  }

  searchPresets(query: string): MapPlace[] {
    return filterPresets(query);
  }

  async search(query: string): Promise<GeocodingResult> {
    const trimmed = query.trim();
    const cacheKey = trimmed.toLowerCase();
    const cached = searchCache.get(cacheKey);
    if (cached) return cached;

    const presets = filterPresets(trimmed);
    if (presets.length >= 1 && trimmed.length < 4) {
      const result: GeocodingResult = { places: presets, source: "preset" };
      searchCache.set(cacheKey, result);
      return result;
    }

    const remote = await this.limiter.run(() => this.searchNominatim(trimmed));
    const places = remote?.length
      ? [...presets, ...remote].slice(0, 8)
      : presets;
    const result: GeocodingResult = {
      places,
      source: remote?.length ? "mixed" : "preset",
    };
    searchCache.set(cacheKey, result);
    return result;
  }

  createDebouncedSearch(
    onResults: (result: GeocodingResult) => void,
    onError?: (message: string) => void
  ): (query: string) => void {
    return debounce((query: string) => {
      this.search(query).then(onResults).catch((e) => {
        onError?.(e instanceof Error ? e.message : "Search failed");
        onResults({ places: filterPresets(query), source: "preset" });
      });
    }, this.config.searchDebounceMs);
  }

  private async searchNominatim(query: string): Promise<MapPlace[]> {
    if (!query || query.length < 3) return [];
    if (typeof fetch === "undefined") return [];

    const url = new URL("/search", this.config.nominatimBaseUrl);
    url.searchParams.set("q", `${query}, Baghdad, Iraq`);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5");
    url.searchParams.set("countrycodes", "iq");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": this.config.userAgent },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;

    return data.map((row) => ({
      label: row.display_name,
      geo: { latitude: parseFloat(row.lat), longitude: parseFloat(row.lon) },
      source: "search" as const,
    }));
  }
}
