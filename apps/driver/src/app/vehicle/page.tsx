"use client";

import { useState } from "react";
import Link from "next/link";
import { getDemoSeedBundle } from "@almosafar/shared";
import { notifyUser } from "@almosafar/ui";
import { useAuth } from "@/context/AuthContext";

const KEY = "almosafar.driver.vehicleNotes";

export default function VehiclePage() {
  const { session } = useAuth();
  const seed = getDemoSeedBundle();
  const vehicle = seed.vehicles.find((v) => v.id === session?.vehicleId);
  const [notes, setNotes] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem(KEY) ?? "" : ""
  );

  return (
    <div className="space-y-4 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-amber-400">
        ← Back to map
      </Link>
      <h1 className="text-lg font-bold">Vehicle profile</h1>
      {vehicle ? (
        <div className="rounded-xl bg-slate-800 p-4 space-y-2">
          <p className="text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="text-sm text-slate-400">Plate: {vehicle.plateNumber}</p>
          <p className="text-sm capitalize">Category: {vehicle.category}</p>
        </div>
      ) : (
        <p className="text-slate-400">No vehicle linked to this demo session.</p>
      )}
      <label className="block text-sm">
        Demo notes (saved locally)
        <textarea
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 p-3 text-white"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="w-full rounded-xl bg-amber-500 py-3 font-bold text-slate-950"
        onClick={() => {
          localStorage.setItem(KEY, notes);
          notifyUser("Vehicle notes saved in this browser.");
        }}
      >
        Save notes
      </button>
    </div>
  );
}
