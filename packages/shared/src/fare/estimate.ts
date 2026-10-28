import type { Address } from "../schemas/common";
import type { FareConfiguration, VehicleCategory } from "../schemas/entities";
import type { RideFareBreakdown } from "../schemas/ride";
import {
  calculateFare,
  distanceKmBetween,
  estimateDurationMinutes,
} from "./calculator";

export function findFareConfiguration(
  configs: FareConfiguration[],
  zoneId: string,
  category: VehicleCategory
): FareConfiguration | undefined {
  return configs.find(
    (c) => c.zoneId === zoneId && c.category === category && c.isActive
  );
}

export function estimateTripFare(params: {
  pickup: Address;
  dropoff: Address;
  fareConfig: FareConfiguration;
  avgSpeedKmh?: number;
  /** Route geometry metrics when available (OSRM or demo route). */
  distanceKm?: number;
  durationMinutes?: number;
}): RideFareBreakdown {
  const distanceKm =
    params.distanceKm ?? distanceKmBetween(params.pickup.geo, params.dropoff.geo);
  const durationMinutes =
    params.durationMinutes ??
    estimateDurationMinutes(distanceKm, params.avgSpeedKmh);
  return calculateFare({
    fareConfig: params.fareConfig,
    distanceKm,
    durationMinutes,
  });
}
