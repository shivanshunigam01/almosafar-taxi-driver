import { useEffect, useState } from "react";
import type { Address, RideFareBreakdown, VehicleCategory } from "@almosafar/shared";
import { estimateTripFare } from "@almosafar/shared";
import { useDataService } from "../context/DataServiceContext";

export function useFareEstimate(
  pickup: Address | null,
  dropoff: Address | null,
  category: VehicleCategory
) {
  const { service } = useDataService();
  const [breakdown, setBreakdown] = useState<RideFareBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pickup || !dropoff) {
      setBreakdown(null);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const zone = await Promise.resolve(service.getDefaultZone());
        const fareConfig = await service.getFareConfiguration(zone.id, category);
        if (!fareConfig) {
          throw new Error("No fare configuration for this category.");
        }
        const estimate = estimateTripFare({ pickup, dropoff, fareConfig });
        if (!cancelled) setBreakdown(estimate);
      } catch (e) {
        if (!cancelled) {
          setBreakdown(null);
          setError(e instanceof Error ? e.message : "Unable to estimate fare.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff, category, service]);

  return { breakdown, loading, error };
}
