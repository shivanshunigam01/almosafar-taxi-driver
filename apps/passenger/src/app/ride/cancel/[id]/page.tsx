"use client";

import { useParams, useRouter } from "next/navigation";
import { PASSENGER_CANCELLATION_REASONS } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";

export default function CancelRidePage() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();

  return (
    <div className="space-y-3 px-4 py-6">
      <h1 className="text-lg font-bold">Cancel ride</h1>
      {PASSENGER_CANCELLATION_REASONS.map((r) => (
        <button
          key={r.id}
          type="button"
          className="block w-full rounded-xl border bg-white p-3 text-start"
          onClick={async () => {
            if (!session) return;
            await repo.cancelRideAsPassenger(id, session.passengerId, r.en);
            router.push("/home");
          }}
        >
          {r.en}
        </button>
      ))}
    </div>
  );
}
