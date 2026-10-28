import type { GeoPoint } from "@almosafar/shared";

export class NavigationLinkService {
  buildGoogleMapsDrivingUrl(destination: GeoPoint): string {
    const lat = destination.latitude;
    const lng = destination.longitude;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Invalid coordinates for navigation.");
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error("Coordinates out of range.");
    }
    const dest = `${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
  }

  openGoogleMapsNavigation(destination: GeoPoint): void {
    const url = this.buildGoogleMapsDrivingUrl(destination);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  formatCoordinates(destination: GeoPoint): string {
    return `${destination.latitude.toFixed(5)}, ${destination.longitude.toFixed(5)}`;
  }

  async copyCoordinates(destination: GeoPoint): Promise<void> {
    await navigator.clipboard.writeText(this.formatCoordinates(destination));
  }
}
