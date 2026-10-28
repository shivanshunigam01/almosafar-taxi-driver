import type { GeoPoint } from "@almosafar/shared";

export type GeolocationState =
  | { status: "idle" }
  | { status: "prompt" }
  | { status: "loading" }
  | { status: "ready"; position: GeoPoint; accuracyM?: number }
  | { status: "error"; message: string };

export class GeolocationService {
  private watchId: number | null = null;

  isSupported(): boolean {
    return typeof navigator !== "undefined" && "geolocation" in navigator;
  }

  async getCurrentPosition(options?: PositionOptions): Promise<GeoPoint> {
    if (!this.isSupported()) {
      throw new Error("Geolocation is not supported in this browser.");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => reject(new Error(err.message)),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000, ...options }
      );
    });
  }

  watchPosition(
    onUpdate: (position: GeoPoint, accuracyM?: number) => void,
    onError?: (message: string) => void
  ): () => void {
    if (!this.isSupported()) {
      onError?.("Geolocation not supported");
      return () => undefined;
    }
    this.clearWatch();
    this.watchId = navigator.geolocation.watchPosition(
      (pos) =>
        onUpdate(
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          pos.coords.accuracy
        ),
      (err) => onError?.(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    return () => this.clearWatch();
  }

  clearWatch(): void {
    if (this.watchId != null && this.isSupported()) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}
