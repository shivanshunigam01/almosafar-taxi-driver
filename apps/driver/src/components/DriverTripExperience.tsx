"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { Ride } from "@almosafar/shared";
import { computeDriverEarnings, formatMoney, getDemoSeedBundle } from "@almosafar/shared";
import { NavigationLinkService } from "@almosafar/maps";
import { notifyUser } from "@almosafar/ui";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

const TripMap = dynamic(
  () => import("@/components/TripMapPanel").then((m) => m.TripMapPanel),
  { ssr: false, loading: () => <div className="h-[45dvh] animate-pulse bg-slate-900" /> }
);

const nav = new NavigationLinkService();

function arrivedKey(rideId: string) {
  return `almosafar.driver.arrived.${rideId}`;
}

function paymentKey(rideId: string) {
  return `almosafar.driver.payment.${rideId}`;
}

type Props = {
  ride: Ride;
  rideId: string;
};

export function DriverTripExperience({ ride, rideId }: Props) {
  const { session } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();
  const seed = getDemoSeedBundle();
  const [pin, setPin] = useState("");
  const [arrivedAtPickup, setArrivedAtPickup] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [showSoloPinHint, setShowSoloPinHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setArrivedAtPickup(sessionStorage.getItem(arrivedKey(rideId)) === "1");
    setPaymentReceived(sessionStorage.getItem(paymentKey(rideId)) === "1");
  }, [rideId]);

  const passenger = useMemo(
    () => seed.passengers.find((p) => p.id === ride.passengerId),
    [ride.passengerId, seed.passengers]
  );

  const navTarget =
    ride.status === "in_progress" || ride.status === "completed"
      ? ride.dropoff.geo
      : ride.pickup.geo;

  const earnings = useMemo(() => {
    const gross = ride.fareFinal?.total ?? ride.fareEstimate?.total;
    return gross ? computeDriverEarnings(gross) : null;
  }, [ride.fareEstimate, ride.fareFinal]);

  const clearTripFlags = () => {
    sessionStorage.removeItem(arrivedKey(rideId));
    sessionStorage.removeItem(paymentKey(rideId));
  };

  const markArrived = () => {
    sessionStorage.setItem(arrivedKey(rideId), "1");
    setArrivedAtPickup(true);
    notifyUser("At pickup — ask passenger for their 4-digit code.");
  };

  const markPaymentReceived = () => {
    sessionStorage.setItem(paymentKey(rideId), "1");
    setPaymentReceived(true);
    notifyUser("Payment recorded (demo). You can complete the trip.");
  };

  const startHeadingToPickup = () => {
    if (!session) return;
    void repo.transitionRideAsDriver({
      rideId,
      driverId: session.driverId,
      toStatus: "driver_arriving",
      note: "Heading to pickup",
    });
  };

  const confirmOtpAndStartRide = () => {
    if (!session || !ride.demoPassengerPin) return;
    if (pin !== ride.demoPassengerPin) {
      notifyUser("Incorrect code — check the passenger app.");
      return;
    }
    void repo
      .transitionRideAsDriver({
        rideId,
        driverId: session.driverId,
        toStatus: "in_progress",
        note: "OTP verified — trip started",
      })
      .then(() => notifyUser("Ride started. Navigate to drop-off."));
  };

  const completeTrip = () => {
    if (!session) return;
    void repo
      .transitionRideAsDriver({
        rideId,
        driverId: session.driverId,
        toStatus: "completed",
        note: "Trip completed",
      })
      .then(() => {
        clearTripFlags();
        notifyUser("Trip complete. Passenger can leave feedback on their app.");
      });
  };

  const phaseTitle = (() => {
    if (ride.status === "accepted") return "Navigate to pickup";
    if (ride.status === "driver_arriving" && !arrivedAtPickup) return "En route to passenger";
    if (ride.status === "driver_arriving" && arrivedAtPickup) return "Enter passenger OTP";
    if (ride.status === "in_progress" && !paymentReceived) return "Trip in progress";
    if (ride.status === "in_progress" && paymentReceived) return "Ready to complete";
    if (ride.status === "completed") return "Trip completed";
    return ride.status.replace(/_/g, " ");
  })();

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col pb-24">
      <div className="px-1 pt-2">
        <p className="text-xs uppercase tracking-wide text-amber-400/90">Live trip · local demo</p>
        <h1 className="text-xl font-bold capitalize text-white">{phaseTitle}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {ride.pickup.label} → {ride.dropoff.label}
        </p>
      </div>

      <div className="mt-3 flex-1 overflow-hidden rounded-2xl border border-slate-700">
        <TripMap ride={ride} mode={ride.status === "driver_arriving" && !arrivedAtPickup ? "to_pickup" : ride.status === "accepted" ? "to_pickup" : "trip"} />
      </div>

      {passenger && (
        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
          <p className="font-semibold text-white">{passenger.displayName}</p>
          <p className="text-xs text-slate-500">Passenger · simulated profile</p>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {(ride.status === "accepted" || ride.status === "driver_arriving" || ride.status === "in_progress") && (
          <>
            <button
              type="button"
              className="w-full rounded-xl bg-brand py-3 font-bold text-white"
              onClick={() => nav.openGoogleMapsNavigation(navTarget)}
            >
              Open navigation (Google Maps)
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-slate-600 py-2 text-sm text-slate-200"
              onClick={() => void nav.copyCoordinates(navTarget).then(() => notifyUser("Coordinates copied"))}
            >
              Copy {ride.status === "in_progress" ? "drop-off" : "pickup"} location
            </button>
          </>
        )}
      </div>

      {ride.status === "accepted" && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white"
          onClick={startHeadingToPickup}
        >
          Start driving to pickup
        </button>
      )}

      {ride.status === "driver_arriving" && !arrivedAtPickup && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white"
          onClick={markArrived}
        >
          I&apos;ve arrived at pickup
        </button>
      )}

      {ride.status === "driver_arriving" && arrivedAtPickup && (
        <div className="mt-4 space-y-3 rounded-2xl border-2 border-amber-500/60 bg-slate-900 p-5">
          <p className="text-sm text-slate-300">
            Passenger shows a 4-digit code on their map. Enter it to confirm pickup and start the ride.
          </p>
          <input
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
            className="w-full rounded-xl bg-slate-800 px-4 py-4 text-center text-2xl tracking-[0.4em] text-white"
            aria-label="Passenger OTP"
          />
          <button
            type="button"
            disabled={pin.length !== 4}
            className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white disabled:opacity-40"
            onClick={confirmOtpAndStartRide}
          >
            Confirm OTP & start ride
          </button>
          <button
            type="button"
            className="w-full text-xs text-amber-400/80 underline"
            onClick={() => setShowSoloPinHint((v) => !v)}
          >
            Solo demo on one device?
          </button>
          {showSoloPinHint && ride.demoPassengerPin && (
            <p className="rounded-lg bg-slate-800 p-3 text-center text-sm text-amber-300">
              Demo code (passenger would see this):{" "}
              <span className="font-mono text-lg font-bold">{ride.demoPassengerPin}</span>
            </p>
          )}
        </div>
      )}

      {ride.status === "in_progress" && !paymentReceived && (
        <>
          <p className="mt-4 text-center text-sm text-slate-400">
            Follow the route to the destination. Collect payment when you arrive.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-brand py-3.5 font-bold text-white"
            onClick={markPaymentReceived}
          >
            Payment received
          </button>
        </>
      )}

      {ride.status === "in_progress" && paymentReceived && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white"
          onClick={completeTrip}
        >
          Complete trip
        </button>
      )}

      {ride.status === "completed" && (
        <div className="mt-4 space-y-3 rounded-2xl border border-emerald-600/40 bg-slate-900 p-5 text-center">
          {earnings && (
            <>
              <p className="text-sm text-slate-400">You earned (demo)</p>
              <p className="text-3xl font-bold text-emerald-400">{formatMoney(earnings.driverNet)}</p>
            </>
          )}
          <p className="text-sm text-slate-400">
            The passenger app can show a receipt and rating screen on their device (port 3001).
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-800 py-3 font-semibold text-white"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-slate-600 py-2 text-sm"
            onClick={() => router.push("/earnings")}
          >
            View earnings
          </button>
        </div>
      )}
    </div>
  );
}
