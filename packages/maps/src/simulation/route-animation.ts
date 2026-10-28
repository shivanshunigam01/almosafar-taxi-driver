import type { GeoPoint } from "@almosafar/shared";

export type AnimatedPosition = GeoPoint & { headingDeg: number };

function bearing(from: GeoPoint, to: GeoPoint): number {
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function pointAlongPolyline(
  polyline: [number, number][],
  t: number
): GeoPoint {
  if (polyline.length === 0) return { latitude: 0, longitude: 0 };
  if (polyline.length === 1) {
    return { latitude: polyline[0][0], longitude: polyline[0][1] };
  }
  const clamped = Math.max(0, Math.min(1, t));
  const totalSegments = polyline.length - 1;
  const scaled = clamped * totalSegments;
  const idx = Math.min(totalSegments - 1, Math.floor(scaled));
  const localT = scaled - idx;
  const [lat1, lng1] = polyline[idx];
  const [lat2, lng2] = polyline[idx + 1];
  return {
    latitude: lat1 + (lat2 - lat1) * localT,
    longitude: lng1 + (lng2 - lng1) * localT,
  };
}

export type RouteAnimatorOptions = {
  polyline: [number, number][];
  durationMs?: number;
  speedMultiplier?: number;
  onUpdate: (pos: AnimatedPosition, progress: number) => void;
  onComplete?: () => void;
  label?: string;
};

/** Deterministic demo driver movement along route geometry. */
export class RouteAnimator {
  private raf = 0;
  private startAt = 0;
  private paused = false;
  private pauseAt = 0;
  private elapsedBeforePause = 0;

  constructor(private opts: RouteAnimatorOptions) {}

  start(): void {
    this.stop();
    const duration =
      (this.opts.durationMs ?? 18000) / (this.opts.speedMultiplier ?? 1);
    this.startAt = performance.now();
    this.elapsedBeforePause = 0;
    this.paused = false;

    const tick = (now: number) => {
      if (this.paused) {
        this.raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = this.elapsedBeforePause + (now - this.startAt);
      const t = Math.min(1, elapsed / duration);
      const pos = pointAlongPolyline(this.opts.polyline, t);
      const next = pointAlongPolyline(this.opts.polyline, Math.min(1, t + 0.02));
      this.opts.onUpdate(
        { ...pos, headingDeg: bearing(pos, next) },
        t
      );
      if (t < 1) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.opts.onComplete?.();
      }
    };
    this.raf = requestAnimationFrame(tick);
  }

  pause(): void {
    if (this.paused) return;
    this.paused = true;
    this.pauseAt = performance.now();
  }

  resume(): void {
    if (!this.paused) return;
    this.elapsedBeforePause += performance.now() - this.pauseAt;
    this.startAt = performance.now();
    this.paused = false;
  }

  reset(): void {
    this.stop();
    const pos = pointAlongPolyline(this.opts.polyline, 0);
    const next = pointAlongPolyline(this.opts.polyline, 0.02);
    this.opts.onUpdate({ ...pos, headingDeg: bearing(pos, next) }, 0);
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
