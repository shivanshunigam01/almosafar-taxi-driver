import { describe, expect, it } from "vitest";
import { NavigationLinkService } from "../services/navigation-link-service";

describe("NavigationLinkService", () => {
  const nav = new NavigationLinkService();

  it("builds Google Maps driving URL", () => {
    const url = nav.buildGoogleMapsDrivingUrl({
      latitude: 33.3152,
      longitude: 44.3661,
    });
    expect(url).toContain("google.com/maps/dir/");
    expect(url).toContain("travelmode=driving");
    expect(url).toContain("33.3152");
    expect(url).toContain("44.3661");
  });

  it("rejects invalid coordinates", () => {
    expect(() =>
      nav.buildGoogleMapsDrivingUrl({ latitude: 999, longitude: 0 })
    ).toThrow();
  });
});
