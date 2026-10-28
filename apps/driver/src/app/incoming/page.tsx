"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Ride } from "@almosafar/shared";
import { formatMoney } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

export default function IncomingPage() {
  const { session } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();
  const [open, setOpen] = useState<Ride[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    return repo.subscribeOpenRideRequests(setOpen);
  }, [repo]);

  if (!session) return null;

  return (
    <div className="space-y-4 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-amber-400">
        ← Back to map
      </Link>
      <h1 className="text-lg font-bold">Simulated incoming requests</h1>
      {open.length === 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-center">
          <p className="text-slate-400">No open requests in this browser store.</p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950"
          >
            Go online on dashboard
          </Link>
        </div>
      )}
      {open.map((r) => (
        <div key={r.id} className="rounded-xl border border-amber-500/50 bg-slate-900 p-4">
          <p className="text-xs font-bold uppercase text-amber-400">Simulated request</p>
          <p className="mt-2 font-medium text-white">{r.pickup.label}</p>
          <p className="text-sm text-slate-400">→ {r.dropoff.label}</p>
          {r.fareEstimate && (
            <p className="mt-2 text-sm text-emerald-400">{formatMoney(r.fareEstimate.total)}</p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busyId === r.id}
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
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
              className="flex-1 rounded-lg bg-slate-700 py-2.5 text-sm font-bold text-white disabled:opacity-50"
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
      ))}
    </div>
  );
}
