"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapProvider,
  MapView,
  RoutePreviewLayer,
  PickupSelector,
  DestinationSelector,
  DriverMarker,
  useMapServices,
} from "@almosafar/maps/react";
import { RouteAnimator } from "@almosafar/maps";
import type { Ride } from "@almosafar/shared";

function demoDriverStartNearPickup(pickup: { lat: number; lng: number }) {
  return { lat: pickup.lat - 0.028, lng: pickup.lng + 0.022 };
}

function RideMapInner({ ride }: { ride: Ride }) {
  const { routing } = useMapServices();
  const [polyline, setPolyline] = useState<[number, number][]>([]);
  const [pickupLeg, setPickupLeg] = useState<[number, number][]>([]);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);

  const pickup = {
    lat: ride.pickup.geo.latitude,
    lng: ride.pickup.geo.longitude,
  };
  const dropoff = {
    lat: ride.dropoff.geo.latitude,
    lng: ride.dropoff.geo.longitude,
  };
  const driverStart = useMemo(() => demoDriverStartNearPickup(pickup), [pickup.lat, pickup.lng]);

  useEffect(() => {
    void routing.route(ride.pickup.geo, ride.dropoff.geo).then((r) => setPolyline(r.polyline));
  }, [ride.pickup, ride.dropoff, routing]);

  useEffect(() => {
    void routing
      .route(
        { latitude: driverStart.lat, longitude: driverStart.lng },
        ride.pickup.geo
      )
      .then((r) => setPickupLeg(r.polyline));
  }, [driverStart, ride.pickup.geo, routing]);

  useEffect(() => {
    if (ride.driverLiveLocation) {
      setDriverPos({
        lat: ride.driverLiveLocation.latitude,
        lng: ride.driverLiveLocation.longitude,
      });
      return;
    }

    if (ride.status === "in_progress" && polyline.length > 1) {
      const animator = new RouteAnimator({
        polyline,
        durationMs: 18_000,
        onUpdate: (pos) => setDriverPos({ lat: pos.latitude, lng: pos.longitude }),
      });
      animator.start();
      return () => animator.stop();
    }

    if (
      (ride.status === "driver_arriving" || ride.status === "accepted") &&
      pickupLeg.length > 1
    ) {
      const animator = new RouteAnimator({
        polyline: pickupLeg,
        durationMs: 12_000,
        onUpdate: (pos) => setDriverPos({ lat: pos.latitude, lng: pos.longitude }),
      });
      animator.start();
      return () => animator.stop();
    }

    if (ride.status === "driver_arriving" || ride.status === "accepted") {
      setDriverPos(driverStart);
    }
  }, [ride.status, ride.driverLiveLocation, polyline, pickupLeg, driverStart]);

  const route = useMemo(() => {
    const line =
      ride.status === "in_progress" ? polyline : pickupLeg.length ? pickupLeg : polyline;
    if (!line.length) return null;
    return {
      source: "demo_seed" as const,
      distanceKm: ride.fareEstimate?.distanceKm ?? 0,
      durationMinutes: ride.fareEstimate?.durationMinutes ?? 0,
      polyline: line,
    };
  }, [polyline, pickupLeg, ride.fareEstimate, ride.status]);

  const fitPoints =
    ride.status === "in_progress" ? [pickup, dropoff] : [driverStart, pickup];

  return (
    <div className="h-64 overflow-hidden rounded-2xl border border-slate-200 md:h-72">
      <MapView fitPoints={fitPoints}>
        <PickupSelector position={pickup} />
        {ride.status === "in_progress" && <DestinationSelector position={dropoff} />}
        <RoutePreviewLayer route={route} />
        {driverPos && <DriverMarker position={driverPos} />}
      </MapView>
    </div>
  );
}

export function ActiveRideMapClient({ ride }: { ride: Ride }) {
  return (
    <MapProvider>
      <RideMapInner ride={ride} />
    </MapProvider>
  );
}
