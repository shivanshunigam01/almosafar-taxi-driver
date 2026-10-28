import type { Ride } from "../schemas/ride";

export type RideRepositoryMode = "local" | "firestore";

export class CloudConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudConnectionError";
  }
}

export interface RideRepository {
  readonly mode: RideRepositoryMode;
  readonly syncLabel: string;

  /** Required for Firestore — must throw CloudConnectionError on failure. */
  verifyConnection?(): Promise<void>;

  createRideRequest(ride: Ride): Promise<Ride>;
  getRide(rideId: string): Promise<Ride | null>;
  subscribeRide(
    rideId: string,
    listener: (ride: Ride | null) => void,
    onError?: (error: Error) => void
  ): () => void;
  cancelRideAsPassenger(
    rideId: string,
    passengerId: string,
    reason: string
  ): Promise<Ride>;
  listRidesForPassenger(passengerId: string): Promise<Ride[]>;

  startLocalDriverSimulation?(rideId: string): void;
  stopLocalDriverSimulation?(rideId: string): void;

  setDriverOnline(driverId: string, isOnline: boolean): Promise<void>;
  isDriverOnline(driverId: string): Promise<boolean>;

  subscribeOpenRideRequests(
    listener: (rides: Ride[]) => void,
    onError?: (error: Error) => void
  ): () => void;

  acceptRideAsDriver(params: {
    rideId: string;
    driverId: string;
    vehicleId: string;
  }): Promise<Ride>;

  rejectRideAsDriver(params: {
    rideId: string;
    driverId: string;
    note?: string;
  }): Promise<Ride>;

  transitionRideAsDriver(params: {
    rideId: string;
    driverId: string;
    toStatus: Ride["status"];
    note?: string;
  }): Promise<Ride>;

  listRidesForDriver(driverId: string): Promise<Ride[]>;

  /** Local demo: inject a deterministic open request when going online. */
  ensureLocalDemoDispatchScenario?(driverId: string): Promise<void>;

  /** Local demo: merge seed trip history for passenger if missing. */
  ensurePassengerDemoHistory?(passengerId: string): Promise<void>;
}
