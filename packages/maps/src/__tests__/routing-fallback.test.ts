import { describe, expect, it } from "vitest";
import { RoutingService } from "../services/routing-service";
import { resolveMapConfig } from "../config";

describe("RoutingService fallback", () => {
  it("returns demo or straight-line route when OSRM is unreachable", async () => {
    const routing = new RoutingService(
      resolveMapConfig({ osrmBaseUrl: "https://invalid.example.invalid" })
    );
    const result = await routing.route(
      { latitude: 33.3152, longitude: 44.3661 },
      { latitude: 33.3406, longitude: 44.3925 }
    );
    expect(result.polyline.length).toBeGreaterThan(1);
    expect(result.distanceKm).toBeGreaterThan(0);
    expect(["demo_seed", "straight_line"]).toContain(result.source);
  });
});
