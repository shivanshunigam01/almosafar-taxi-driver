import { useEffect, useState } from "react";
import type { Ride } from "@almosafar/shared";
import { useDataService } from "../context/DataServiceContext";

export function useRideSubscription(rideId: string | null) {
  const { service } = useDataService();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(!!rideId);

  useEffect(() => {
    if (!rideId) {
      setRide(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = service.subscribeRide(rideId, (next) => {
      setRide(next);
      setLoading(false);
    });
    return unsub;
  }, [rideId, service]);

  return { ride, loading };
}
