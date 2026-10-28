import { distanceKmBetween, estimateDurationMinutes } from "@almosafar/shared";
import type { GeoPoint } from "@almosafar/shared";
import type { MapProviderConfig, RouteResult } from "../types";
import { createRateLimiter } from "./throttle";

const routeCache = new Map<string, RouteResult>();

function cacheKey(a: GeoPoint, b: GeoPoint): string {
  return `${a.latitude.toFixed(5)},${a.longitude.toFixed(5)}-${b.latitude.toFixed(5)},${b.longitude.toFixed(5)}`;
}

function straightLineRoute(
  pickup: GeoPoint,
  dropoff: GeoPoint,
  warning: string
): RouteResult {
  const distanceKm = distanceKmBetween(pickup, dropoff);
  const durationMinutes = estimateDurationMinutes(distanceKm);
  return {
    source: "straight_line",
    distanceKm,
    durationMinutes,
    polyline: [
      [pickup.latitude, pickup.longitude],
      [dropoff.latitude, dropoff.longitude],
    ],
    warning,
  };
}

/** Seeded demo geometry — not real road data. */
function demoSeedRoute(pickup: GeoPoint, dropoff: GeoPoint): RouteResult {
  const steps = 8;
  const polyline: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lat = pickup.latitude + (dropoff.latitude - pickup.latitude) * t;
    const lng =
      pickup.longitude +
      (dropoff.longitude - pickup.longitude) * t +
      Math.sin(t * Math.PI) * 0.008;
    polyline.push([lat, lng]);
  }
  const distanceKm = distanceKmBetween(pickup, dropoff) * 1.18;
  const durationMinutes = estimateDurationMinutes(distanceKm);
  return {
    source: "demo_seed",
    distanceKm,
    durationMinutes,
    polyline,
    warning: "Demo route geometry (simulated curves — not live navigation).",
  };
}

export class RoutingService {
  private limiter;

  constructor(private config: MapProviderConfig) {
    this.limiter = createRateLimiter(800);
  }

  async route(pickup: GeoPoint, dropoff: GeoPoint): Promise<RouteResult> {
    const key = cacheKey(pickup, dropoff);
    const hit = routeCache.get(key);
    if (hit) return hit;

    const osrm = await this.limiter.run(() => this.fetchOsrm(pickup, dropoff));
    const result =
      osrm ??
      demoSeedRoute(pickup, dropoff) ??
      straightLineRoute(
        pickup,
        dropoff,
        "Routing unavailable — showing straight-line estimate."
      );

    routeCache.set(key, result);
    return result;
  }

  private async fetchOsrm(
    pickup: GeoPoint,
    dropoff: GeoPoint
  ): Promise<RouteResult | null> {
    if (typeof fetch === "undefined") return null;
    try {
      const path = `${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}`;
      const url = `${this.config.osrmBaseUrl.replace(/\/$/, "")}/route/v1/driving/${path}?overview=full&geometries=geojson`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) return null;
      const json = (await res.json()) as {
        routes?: Array<{
          distance: number;
          duration: number;
          geometry: { coordinates: [number, number][] };
        }>;
      };
      const route = json.routes?.[0];
      if (!route) return null;
      const polyline = route.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );
      return {
        source: "osrm",
        distanceKm: route.distance / 1000,
        durationMinutes: Math.max(1, Math.round(route.duration / 60)),
        polyline,
        attribution: "Routing © OSRM / OpenStreetMap contributors",
      };
    } catch {
      return null;
    }
  }
}
