import {
  LocalDemoRideRepository,
  type RideRepository,
} from "@almosafar/shared";
import type { Ride } from "@almosafar/shared";
import { rideSnapshotSchema } from "../storage/schemas";
import { isBrowser, writeStorage, removeStorage } from "../storage/browser";
import { storageKey, SYNC_CHANNEL, type DemoAppScope } from "../storage/keys";

/**
 * Persists {@link LocalDemoRideRepository} to localStorage for one origin (passenger OR driver site).
 * Does not sync across devices or different hostnames.
 */
export class LocalStorageRideRepository implements RideRepository {
  readonly mode = "local" as const;
  readonly syncLabel: string;
  private inner: LocalDemoRideRepository;
  private key: string;
  private scope: DemoAppScope;
  private channel: BroadcastChannel | null = null;

  constructor(scope: DemoAppScope) {
    this.scope = scope;
    this.key = storageKey(scope);
    this.syncLabel =
      scope === "passenger"
        ? "Local demo (this browser · passenger site)"
        : "Local demo (this browser · driver site · simulated requests)";
    this.inner = new LocalDemoRideRepository();
    this.hydrate();
    if (isBrowser() && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(SYNC_CHANNEL);
      this.channel.onmessage = (ev) => {
        if (ev.data?.scope === this.scope && ev.data?.type === "rides-updated") {
          this.hydrateFromRaw(ev.data.payload);
        }
      };
      window.addEventListener("storage", (e) => {
        if (e.key === this.key && e.newValue) {
          this.hydrateFromRaw(e.newValue);
        }
      });
    }
  }

  private hydrate(): void {
    const raw = isBrowser() ? localStorage.getItem(this.key) : null;
    if (raw) this.hydrateFromRaw(raw);
  }

  private hydrateFromRaw(raw: string): void {
    const parsed = rideSnapshotSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return;
    this.inner.restoreSnapshot({
      rides: parsed.data.rides,
      driverOnline: parsed.data.driverOnline,
    });
  }

  private persist(): void {
    if (!isBrowser()) return;
    const snap = this.inner.exportSnapshot();
    const envelope = rideSnapshotSchema.parse({
      schemaVersion: 1,
      ...snap,
      updatedAt: new Date().toISOString(),
    });
    writeStorage(this.key, envelope);
    this.channel?.postMessage({
      type: "rides-updated",
      scope: this.scope,
      payload: JSON.stringify(envelope),
    });
  }

  private wrap<T>(fn: () => Promise<T>): Promise<T> {
    return fn().then((result) => {
      this.persist();
      return result;
    });
  }

  resetDemo(): void {
    removeStorage(this.key);
    this.inner = new LocalDemoRideRepository();
  }

  exportJson(): string {
    const snap = this.inner.exportSnapshot();
    return JSON.stringify(
      rideSnapshotSchema.parse({
        schemaVersion: 1,
        ...snap,
        updatedAt: new Date().toISOString(),
      }),
      null,
      2
    );
  }

  importJson(json: string): void {
    const data = rideSnapshotSchema.parse(JSON.parse(json));
    this.inner.restoreSnapshot({
      rides: data.rides,
      driverOnline: data.driverOnline,
    });
    this.persist();
  }

  // —— RideRepository delegation ——

  createRideRequest(ride: Ride): Promise<Ride> {
    return this.wrap(() => this.inner.createRideRequest(ride));
  }

  getRide(rideId: string): Promise<Ride | null> {
    return this.inner.getRide(rideId);
  }

  subscribeRide(
    rideId: string,
    listener: (ride: Ride | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.inner.subscribeRide(rideId, listener, onError);
  }

  cancelRideAsPassenger(
    rideId: string,
    passengerId: string,
    reason: string
  ): Promise<Ride> {
    return this.wrap(() =>
      this.inner.cancelRideAsPassenger(rideId, passengerId, reason)
    );
  }

  listRidesForPassenger(passengerId: string): Promise<Ride[]> {
    return this.inner.listRidesForPassenger(passengerId);
  }

  startLocalDriverSimulation?(rideId: string): void {
    this.inner.startLocalDriverSimulation?.(rideId);
    this.persist();
  }

  stopLocalDriverSimulation?(rideId: string): void {
    this.inner.stopLocalDriverSimulation?.(rideId);
    this.persist();
  }

  setDriverOnline(driverId: string, isOnline: boolean): Promise<void> {
    return this.wrap(() => this.inner.setDriverOnline(driverId, isOnline));
  }

  isDriverOnline(driverId: string): Promise<boolean> {
    return this.inner.isDriverOnline(driverId);
  }

  subscribeOpenRideRequests(
    listener: (rides: Ride[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.inner.subscribeOpenRideRequests(listener, onError);
  }

  acceptRideAsDriver(params: {
    rideId: string;
    driverId: string;
    vehicleId: string;
  }): Promise<Ride> {
    return this.wrap(() => this.inner.acceptRideAsDriver(params));
  }

  rejectRideAsDriver(params: {
    rideId: string;
    driverId: string;
    note?: string;
  }): Promise<Ride> {
    return this.wrap(() => this.inner.rejectRideAsDriver(params));
  }

  transitionRideAsDriver(params: {
    rideId: string;
    driverId: string;
    toStatus: Ride["status"];
    note?: string;
  }): Promise<Ride> {
    return this.wrap(() => this.inner.transitionRideAsDriver(params));
  }

  listRidesForDriver(driverId: string): Promise<Ride[]> {
    return this.inner.listRidesForDriver(driverId);
  }

  ensureLocalDemoDispatchScenario?(driverId: string): Promise<void> {
    return this.wrap(() =>
      this.inner.ensureLocalDemoDispatchScenario!(driverId)
    );
  }

  ensurePassengerDemoHistory?(passengerId: string): Promise<void> {
    return this.wrap(() => this.inner.ensurePassengerDemoHistory!(passengerId));
  }
}
