"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useRideRepo } from "@/context/RideRepoContext";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    repo.getRide(id).then(setRide);
  }, [id, repo]);

  if (!ride) return <p className="p-4">Loading…</p>;

  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6 pb-24">
      <Link href="/home/history" className="text-sm font-medium text-teal-700">
        ← Trip history
      </Link>
      <h1 className="text-xl font-bold text-slate-900">Trip details</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="capitalize font-semibold">{ride.status.replace(/_/g, " ")}</p>
        <p className="mt-2 text-sm text-slate-600">
          {ride.pickup.label} → {ride.dropoff.label}
        </p>
        {ride.fareEstimate && (
          <p className="mt-3 text-lg font-bold text-teal-800">
            {formatMoney((ride.fareFinal ?? ride.fareEstimate).total)}
          </p>
        )}
      </div>
      {ride.status === "completed" && (
        <Link
          href={`/ride/rating/${id}`}
          className="block rounded-xl bg-teal-700 py-3 text-center font-semibold text-white"
        >
          Rate this trip
        </Link>
      )}
      {(ride.status === "accepted" ||
        ride.status === "driver_arriving" ||
        ride.status === "in_progress") && (
        <Link
          href={`/ride/active/${id}`}
          className="block rounded-xl border border-teal-600 py-3 text-center font-semibold text-teal-800"
        >
          Open live trip
        </Link>
      )}
      <Link href="/home" className="block text-center text-sm text-teal-700">
        Book another ride
      </Link>
    </div>
  );
}
