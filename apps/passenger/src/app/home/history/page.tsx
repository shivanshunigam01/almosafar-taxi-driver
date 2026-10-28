"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

export default function HistoryPage() {
  const { session } = useAuth();
  const repo = useRideRepo();
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (!session) return;
    repo.listRidesForPassenger(session.passengerId).then(setRides);
  }, [session, repo]);

  return (
    <div className="space-y-3 bg-slate-50 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Ride history</h1>
      {rides.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-600">No trips yet in this browser.</p>
          <Link
            href="/home"
            className="mt-4 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white"
          >
            Book on the map
          </Link>
        </div>
      )}
      {rides.map((r) => (
        <Link
          key={r.id}
          href={`/history/${r.id}`}
          className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand"
        >
          <p className="font-medium capitalize text-slate-900">{r.status.replace(/_/g, " ")}</p>
          <p className="text-xs text-slate-500">{r.pickup.label}</p>
          {r.fareEstimate && (
            <p className="mt-1 text-sm font-semibold text-brand-dark">
              {formatMoney(r.fareEstimate.total)}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
