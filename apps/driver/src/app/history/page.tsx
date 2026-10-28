"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Ride } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

export default function DriverHistory() {
  const { session } = useAuth();
  const repo = useRideRepo();
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (!session) return;
    repo.listRidesForDriver(session.driverId).then(setRides);
  }, [session, repo]);

  return (
    <div className="space-y-3 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-amber-400">
        ← Back to map
      </Link>
      <h1 className="text-lg font-bold">Ride history</h1>
      {rides.length === 0 && (
        <div className="rounded-xl border border-slate-700 p-4 text-center text-slate-400">
          <p>No trips yet in this browser.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-amber-400 underline">
            Go online and accept a demo ride
          </Link>
        </div>
      )}
      {rides.map((r) => (
        <Link
          key={r.id}
          href={`/trip/${r.id}`}
          className="block rounded-xl bg-slate-800 p-3 capitalize hover:bg-slate-700"
        >
          {r.status.replace(/_/g, " ")} — {r.pickup.label}
        </Link>
      ))}
    </div>
  );
}
