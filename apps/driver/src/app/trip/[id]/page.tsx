"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Ride } from "@almosafar/shared";
import { useRideRepo } from "@/context/RideRepoContext";
import { DriverTripExperience } from "@/components/DriverTripExperience";

export default function TripPage() {
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    return repo.subscribeRide(id, setRide);
  }, [id, repo]);

  if (!ride) {
    return <p className="p-4 text-slate-400">Loading trip…</p>;
  }

  return <DriverTripExperience ride={ride} rideId={id} />;
}
