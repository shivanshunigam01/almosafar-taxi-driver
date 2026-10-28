"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

function formatTripDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function HistoryPage() {
  const { session } = useAuth();
  const repo = useRideRepo();
  const [rides, setRides] = useState<Ride[]>([]);

  const load = useCallback(async () => {
    if (!session) return;
    await repo.ensurePassengerDemoHistory?.(session.passengerId);
    const list = await repo.listRidesForPassenger(session.passengerId);
    setRides(list.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)));
  }, [session, repo]);

  useEffect(() => {
    void load();
  }, [load]);

  const past = rides.filter((r) => r.status === "completed" || r.status === "cancelled");
  const active = rides.filter((r) =>
    ["requested", "accepted", "driver_arriving", "in_progress"].includes(r.status)
  );

  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-slate-900">Your trips</h1>
      {active.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
          {active.map((r) => (
            <Link
              key={r.id}
              href={`/ride/active/${r.id}`}
              className="mb-2 block rounded-xl border border-brand/30 bg-blue-50 p-4 shadow-sm"
            >
              <p className="font-medium capitalize text-brand">{r.status.replace(/_/g, " ")}</p>
              <p className="text-xs text-slate-600">{r.pickup.label}</p>
            </Link>
          ))}
        </section>
      )}
      {past.length === 0 && active.length === 0 && (
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
      {past.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Previous</p>
          <div className="space-y-2">
            {past.map((r) => (
              <Link
                key={r.id}
                href={`/history/${r.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium capitalize text-slate-900">
                      {r.status === "completed" ? "Completed" : r.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500">{formatTripDate(r.requestedAt)}</p>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {r.pickup.label.split("—").pop()?.trim() ?? r.pickup.label}
                    </p>
                  </div>
                  {(r.fareFinal ?? r.fareEstimate) && (
                    <p className="shrink-0 text-sm font-bold text-brand-dark">
                      {formatMoney((r.fareFinal ?? r.fareEstimate)!.total)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
