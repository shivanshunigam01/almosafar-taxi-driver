import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  LocalStorageRideRepository,
  getDemoSeedBundle,
  buildRideRequest,
  estimateTripFare,
  DEMO_LOCATIONS,
} from "@almosafar/demo-core";

const store = new Map<string, string>();

vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
  removeItem: (k: string) => store.delete(k),
});

vi.stubGlobal("window", {
  addEventListener: () => {},
  localStorage: globalThis.localStorage,
});

describe("LocalStorageRideRepository", () => {
  beforeEach(() => store.clear());

  it("persists ride after createRideRequest", async () => {
    const seed = getDemoSeedBundle();
    const repo = new LocalStorageRideRepository("passenger");
    const fare = estimateTripFare({
      pickup: DEMO_LOCATIONS[0]!,
      dropoff: DEMO_LOCATIONS[1]!,
      fareConfig: seed.fareConfigurations[0]!,
    });
    const ride = buildRideRequest({
      passengerId: seed.passengers[0]!.id,
      zoneId: seed.zone.id,
      category: "economy",
      pickup: DEMO_LOCATIONS[0]!,
      dropoff: DEMO_LOCATIONS[1]!,
      fareEstimate: fare,
    });
    await repo.createRideRequest(ride);
    const repo2 = new LocalStorageRideRepository("passenger");
    const loaded = await repo2.getRide(ride.id);
    expect(loaded?.id).toBe(ride.id);
  });
});
