import { useCallback, useEffect, useState } from "react";
import { ACTIVE_RIDE_STATUSES, type Ride } from "@almosafar/shared";
import { useAuth } from "../context/AuthContext";
import { useDataService } from "../context/DataServiceContext";

export function useDriverActiveRide() {
  const { driver } = useAuth();
  const { service } = useDataService();
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!driver) {
      setActiveRide(null);
      setLoading(false);
      return;
    }
    const rides = await service.listRidesForDriver(driver.id);
    const active =
      rides.find(
        (r) =>
          r.driverId === driver.id &&
          ACTIVE_RIDE_STATUSES.includes(r.status) &&
          r.status !== "requested"
      ) ?? null;
    setActiveRide(active);
    setLoading(false);
  }, [driver, service]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { activeRide, loading, refresh };
}
