import { createDemoId } from "../constants/ids";
import { estimateTripFare } from "../fare/estimate";
import { buildRideRequest } from "../rides/create";
import type { Ride } from "../schemas/ride";
import { getDemoSeedBundle } from "./seed";

export type DriverNearGeo = { latitude: number; longitude: number };

/** Deterministic demo ride for driver dispatch when local mode has no passenger app connected. */
export function buildLocalDemoDispatchRide(
  _driverId: string,
  driverNear?: DriverNearGeo
): Ride {
  const seed = getDemoSeedBundle();
  const passenger = seed.passengers[0];
  const pickup = driverNear
    ? {
        label: "Nearby pickup — ~1.2 km from you",
        geo: {
          latitude: driverNear.latitude + 0.009,
          longitude: driverNear.longitude - 0.007,
        },
      }
    : {
        label: "Demo — Al-Karrada, Baghdad",
        geo: { latitude: 33.2958, longitude: 44.3859 },
      };
  const dropoff = {
    label: "Demo — Baghdad International Airport (BGW)",
    geo: { latitude: 33.2625, longitude: 44.2346 },
  };
  const fareConfig = seed.fareConfigurations.find((f) => f.category === "comfort")!;
  const estimate = estimateTripFare({ pickup, dropoff, fareConfig });

  return buildRideRequest({
    passengerId: passenger.id,
    zoneId: seed.zone.id,
    category: "comfort",
    pickup,
    dropoff,
    fareEstimate: estimate,
    isDemoData: true,
  });
}

export function localScenarioRideIdForDriver(driverId: string): string {
  return createDemoId(`dispatch_${driverId.replace(/[^a-z0-9]/gi, "").slice(0, 24)}`);
}
