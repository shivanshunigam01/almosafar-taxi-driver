"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, User } from "lucide-react";
import type { Ride } from "@almosafar/shared";
import { formatMoney, getDemoSeedBundle } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

export default function IncomingPage() {
  const { session } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();
  const [open, setOpen] = useState<Ride[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const seed = getDemoSeedBundle();

  useEffect(() => {
    return repo.subscribeOpenRideRequests(setOpen);
  }, [repo]);

  const passengerFor = useMemo(
    () => (ride: Ride) => seed.passengers.find((p) => p.id === ride.passengerId),
    [seed.passengers]
  );

  if (!session) return null;

  return (
    <div className="space-y-4 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-brand">
        ← Back to dashboard
      </Link>
      <h1 className="text-lg font-bold">Incoming requests</h1>
      {open.length === 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-center">
          <p className="text-slate-400">No open requests. Start service on the dashboard first.</p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white"
          >
            Open dashboard
          </Link>
        </div>
      )}
      {open.map((r) => {
        const passenger = passengerFor(r);
        return (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900">
            <p className="text-xs font-bold uppercase text-brand">Passenger request</p>
            {passenger && (
              <div className="mt-2 flex items-center gap-2">
                <User className="h-4 w-4 text-brand" />
                <span className="font-semibold">{passenger.displayName}</span>
                <a href={`tel:${passenger.phoneE164}`} className="flex items-center gap-1 text-sm text-brand">
                  <Phone className="h-3 w-3" />
                  {passenger.phoneE164}
                </a>
              </div>
            )}
            <p className="mt-2 text-sm font-medium">Pickup: {r.pickup.label}</p>
            <p className="text-sm text-slate-600">Destination: {r.dropoff.label}</p>
            {r.fareEstimate && (
              <p className="mt-2 text-sm font-medium">{formatMoney(r.fareEstimate.total)}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={busyId === r.id}
                className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-bold text-white disabled:opacity-50"
                onClick={async () => {
                  setBusyId(r.id);
                  try {
                    await repo.acceptRideAsDriver({
                      rideId: r.id,
                      driverId: session.driverId,
                      vehicleId: session.vehicleId,
                    });
                    router.push(`/trip/${r.id}`);
                  } finally {
                    setBusyId(null);
                  }
                }}
              >
                Accept
              </button>
              <button
                type="button"
                disabled={busyId === r.id}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                onClick={async () => {
                  setBusyId(r.id);
                  try {
                    await repo.rejectRideAsDriver({
                      rideId: r.id,
                      driverId: session.driverId,
                    });
                  } finally {
                    setBusyId(null);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
