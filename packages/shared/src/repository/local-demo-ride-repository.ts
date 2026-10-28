import { createDemoId } from "../constants/ids";
import { getDemoSeedBundle } from "../demo/seed";
import { canPassengerCancelRide } from "../rides/cancellation";
import {
  assertDriverTransition,
  generateDemoPassengerPin,
  RideClaimError,
} from "../rides/driver-authorization";
import { transitionRide } from "../rides/mutations";
import {
  buildLocalDemoDispatchRide,
  localScenarioRideIdForDriver,
} from "../demo/driver-scenarios";
import type { Ride } from "../schemas/ride";
import { parseRide } from "../validation/parse";
import { LOCAL_SYNC_LABEL } from "../data/config";
import type { RideRepository } from "./ride-repository";

type Listener = (ride: Ride | null) => void;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface LocalDemoRideRepositoryOptions {
  onRideCompleted?: (ride: Ride) => void;
}

export class LocalDemoRideRepository implements RideRepository {
  readonly mode = "local" as const;
  readonly syncLabel = LOCAL_SYNC_LABEL;

  private rides = new Map<string, Ride>();
  private listeners = new Map<string, Set<Listener>>();
  private simTimers = new Map<string, ReturnType<typeof setTimeout>[]>();
  private drivers = getDemoSeedBundle().drivers;
  private onRideCompleted?: (ride: Ride) => void;
  private driverOnline = new Map<string, boolean>();
  private openListeners = new Set<(rides: Ride[]) => void>();

  constructor(options?: LocalDemoRideRepositoryOptions) {
    this.onRideCompleted = options?.onRideCompleted;
    getDemoSeedBundle().rides.forEach((r) => this.rides.set(r.id, r));
    this.drivers.forEach((d) => this.driverOnline.set(d.id, d.isOnline));
  }

  /** Serializable state for browser localStorage (demo-core). */
  exportSnapshot(): {
    rides: Ride[];
    driverOnline: Record<string, boolean>;
  } {
    return {
      rides: [...this.rides.values()],
      driverOnline: Object.fromEntries(this.driverOnline.entries()),
    };
  }

  restoreSnapshot(snapshot: {
    rides: Ride[];
    driverOnline: Record<string, boolean>;
  }): void {
    this.rides.clear();
    snapshot.rides.forEach((r) => this.rides.set(r.id, parseRide(r)));
    this.driverOnline.clear();
    Object.entries(snapshot.driverOnline).forEach(([id, online]) =>
      this.driverOnline.set(id, online)
    );
    this.emitOpenRequests();
    [...this.rides.keys()].forEach((id) => this.emit(id));
  }

  private getOpenRides(): Ride[] {
    return [...this.rides.values()].filter(
      (r) => r.status === "requested" && !r.driverId
    );
  }

  private emitOpenRequests(): void {
    const open = this.getOpenRides();
    this.openListeners.forEach((fn) => fn(open));
  }

  private emit(rideId: string): void {
    const ride = this.rides.get(rideId) ?? null;
    this.listeners.get(rideId)?.forEach((fn) => fn(ride));
    this.emitOpenRequests();
  }

  async createRideRequest(ride: Ride): Promise<Ride> {
    const parsed = parseRide(ride);
    this.rides.set(parsed.id, parsed);
    this.emit(parsed.id);
    return parsed;
  }

  async getRide(rideId: string): Promise<Ride | null> {
    return this.rides.get(rideId) ?? null;
  }

  subscribeRide(
    rideId: string,
    listener: Listener,
    _onError?: (error: Error) => void
  ): () => void {
    if (!this.listeners.has(rideId)) this.listeners.set(rideId, new Set());
    this.listeners.get(rideId)!.add(listener);
    listener(this.rides.get(rideId) ?? null);
    return () => this.listeners.get(rideId)?.delete(listener);
  }

  async cancelRideAsPassenger(
    rideId: string,
    passengerId: string,
    reason: string
  ): Promise<Ride> {
    const ride = this.rides.get(rideId);
    if (!ride) throw new Error("Ride not found");
    if (ride.passengerId !== passengerId) throw new Error("Not your ride");
    const policy = canPassengerCancelRide(ride.status);
    if (!policy.allowed) throw new Error(policy.message);

    const next = transitionRide({
      ride,
      toStatus: "cancelled",
      actorId: passengerId,
      actorRole: "passenger",
      note: reason,
    });
    const withMeta: Ride = {
      ...next,
      cancellationReason: reason,
      cancelledAt: next.updatedAt,
    };
    this.rides.set(rideId, withMeta);
    this.emit(rideId);
    this.stopLocalDriverSimulation(rideId);
    return withMeta;
  }

  async listRidesForPassenger(passengerId: string): Promise<Ride[]> {
    return [...this.rides.values()]
      .filter((r) => r.passengerId === passengerId)
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }

  startLocalDriverSimulation(rideId: string): void {
    this.stopLocalDriverSimulation(rideId);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const driver = this.drivers.find((d) => d.isOnline) ?? this.drivers[0];
    if (!driver) return;

    const schedule = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    schedule(2500, () =>
      this.applyTransition(rideId, "accepted", driver.id, driver.vehicleId)
    );
    schedule(6000, () =>
      this.applyTransition(rideId, "driver_arriving", driver.id, driver.vehicleId)
    );
    schedule(9000, () => {
      this.applyTransition(rideId, "in_progress", driver.id, driver.vehicleId);
      this.startLocationTicks(rideId, timers);
    });
    schedule(22000, () => this.completeRide(rideId, driver.id));

    this.simTimers.set(rideId, timers);
  }

  stopLocalDriverSimulation(rideId: string): void {
    this.simTimers.get(rideId)?.forEach(clearTimeout);
    this.simTimers.delete(rideId);
  }

  private startLocationTicks(rideId: string, timers: ReturnType<typeof setTimeout>[]): void {
    let step = 0;
    const tick = () => {
      const current = this.rides.get(rideId);
      if (!current || current.status !== "in_progress") return;
      step += 1;
      const t = Math.min(1, step / 12);
      const lat = lerp(
        current.pickup.geo.latitude,
        current.dropoff.geo.latitude,
        t
      );
      const lng = lerp(
        current.pickup.geo.longitude,
        current.dropoff.geo.longitude,
        t
      );
      this.rides.set(rideId, {
        ...current,
        driverLiveLocation: { latitude: lat, longitude: lng },
        updatedAt: new Date().toISOString(),
      });
      this.emit(rideId);
      if (t < 1) timers.push(setTimeout(tick, 1200));
    };
    tick();
  }

  private applyTransition(
    rideId: string,
    status: Ride["status"],
    driverId: string,
    vehicleId?: string
  ): void {
    const ride = this.rides.get(rideId);
    if (!ride || ride.status === "cancelled" || ride.status === "completed") return;
    try {
      let next = transitionRide({
        ride,
        toStatus: status,
        actorId: driverId,
        actorRole: "driver",
        driverId,
        vehicleId,
      });
      if (status === "accepted") {
        next = { ...next, demoPassengerPin: generateDemoPassengerPin() };
      }
      this.rides.set(rideId, next);
      this.emit(rideId);
    } catch {
      /* cancelled by passenger */
    }
  }

  private completeRide(rideId: string, driverId: string): void {
    const ride = this.rides.get(rideId);
    if (!ride || ride.status === "cancelled") return;
    try {
      let next = transitionRide({
        ride,
        toStatus: "completed",
        actorId: driverId,
        actorRole: "driver",
      });
      next = {
        ...next,
        fareFinal: next.fareEstimate,
        completedAt: next.updatedAt,
        mockPaymentId: createDemoId(`payment_${rideId}`),
      };
      this.rides.set(rideId, next);
      this.emit(rideId);
      this.onRideCompleted?.(next);
    } catch {
      /* ignore */
    }
    this.stopLocalDriverSimulation(rideId);
  }

  async setDriverOnline(driverId: string, isOnline: boolean): Promise<void> {
    this.driverOnline.set(driverId, isOnline);
    const d = this.drivers.find((x) => x.id === driverId);
    if (d) d.isOnline = isOnline;
    if (isOnline) await this.ensureLocalDemoDispatchScenario(driverId);
    this.emitOpenRequests();
  }

  async isDriverOnline(driverId: string): Promise<boolean> {
    return this.driverOnline.get(driverId) ?? false;
  }

  subscribeOpenRideRequests(
    listener: (rides: Ride[]) => void,
    _onError?: (error: Error) => void
  ): () => void {
    this.openListeners.add(listener);
    listener(this.getOpenRides());
    return () => this.openListeners.delete(listener);
  }

  async ensureLocalDemoDispatchScenario(driverId: string): Promise<void> {
    if (this.getOpenRides().length > 0) return;
    const scenarioId = localScenarioRideIdForDriver(driverId);
    const existing = this.rides.get(scenarioId);
    if (existing) {
      if (existing.status === "requested" && !existing.driverId) return;
      this.rides.delete(scenarioId);
    }
    const ride = buildLocalDemoDispatchRide(driverId);
    const withId = { ...ride, id: scenarioId };
    this.rides.set(withId.id, withId);
    this.emit(withId.id);
  }

  async acceptRideAsDriver(params: {
    rideId: string;
    driverId: string;
    vehicleId: string;
  }): Promise<Ride> {
    if (!(await this.isDriverOnline(params.driverId))) {
      throw new RideClaimError("Go online to accept rides.");
    }
    const ride = this.rides.get(params.rideId);
    if (!ride) throw new RideClaimError("Ride not found.");
    assertDriverTransition(ride, params.driverId, "accepted");
    const next = transitionRide({
      ride,
      toStatus: "accepted",
      actorId: params.driverId,
      actorRole: "driver",
      driverId: params.driverId,
      vehicleId: params.vehicleId,
      note: "Driver accepted (demo claim)",
    });
    const withPin = {
      ...next,
      demoPassengerPin: generateDemoPassengerPin(),
    };
    this.rides.set(params.rideId, withPin);
    this.emit(params.rideId);
    return withPin;
  }

  async rejectRideAsDriver(params: {
    rideId: string;
    driverId: string;
    note?: string;
  }): Promise<Ride> {
    const ride = this.rides.get(params.rideId);
    if (!ride) throw new Error("Ride not found");
    assertDriverTransition(ride, params.driverId, "rejected");
    const next = transitionRide({
      ride,
      toStatus: "rejected",
      actorId: params.driverId,
      actorRole: "driver",
      note: params.note ?? "Driver declined",
    });
    this.rides.set(params.rideId, next);
    this.emit(params.rideId);
    if (params.rideId === localScenarioRideIdForDriver(params.driverId)) {
      this.rides.delete(params.rideId);
      await this.ensureLocalDemoDispatchScenario(params.driverId);
    }
    return next;
  }

  async transitionRideAsDriver(params: {
    rideId: string;
    driverId: string;
    toStatus: Ride["status"];
    note?: string;
  }): Promise<Ride> {
    const ride = this.rides.get(params.rideId);
    if (!ride) throw new Error("Ride not found");
    assertDriverTransition(ride, params.driverId, params.toStatus);
    let next = transitionRide({
      ride,
      toStatus: params.toStatus,
      actorId: params.driverId,
      actorRole: "driver",
      note: params.note,
    });
    if (params.toStatus === "completed") {
      next = {
        ...next,
        fareFinal: next.fareEstimate,
        completedAt: next.updatedAt,
        mockPaymentId: createDemoId(`payment_${params.rideId}`),
      };
      this.onRideCompleted?.(next);
    }
    if (params.toStatus === "in_progress") {
      const timers: ReturnType<typeof setTimeout>[] = [];
      this.simTimers.set(params.rideId, timers);
      this.startLocationTicks(params.rideId, timers);
    }
    this.rides.set(params.rideId, next);
    this.emit(params.rideId);
    return next;
  }

  async listRidesForDriver(driverId: string): Promise<Ride[]> {
    return [...this.rides.values()]
      .filter((r) => r.driverId === driverId)
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }
}
