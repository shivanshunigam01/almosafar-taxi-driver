"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ride } from "@almosafar/shared";
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

type MapMode = "to_pickup" | "trip";

function demoDriverStartNearPickup(pickup: { lat: number; lng: number }) {
  return { lat: pickup.lat - 0.028, lng: pickup.lng + 0.022 };
}

function Inner({ ride, mode }: { ride: Ride; mode: MapMode }) {
  const { routing } = useMapServices();
  const [polyline, setPolyline] = useState<[number, number][]>([]);
  const [pickupLeg, setPickupLeg] = useState<[number, number][]>([]);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);

  const pickup = { lat: ride.pickup.geo.latitude, lng: ride.pickup.geo.longitude };
  const dropoff = { lat: ride.dropoff.geo.latitude, lng: ride.dropoff.geo.longitude };
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

    const toPickup = mode === "to_pickup" && pickupLeg.length > 1;
    const leg = toPickup ? pickupLeg : polyline;

    if (ride.status === "in_progress" && polyline.length > 1) {
      const animator = new RouteAnimator({
        polyline,
        durationMs: 18_000,
        onUpdate: (p) => setDriverPos({ lat: p.latitude, lng: p.longitude }),
      });
      animator.start();
      return () => animator.stop();
    }

    if (
      (ride.status === "driver_arriving" || ride.status === "accepted") &&
      toPickup &&
      leg.length > 1
    ) {
      const animator = new RouteAnimator({
        polyline: leg,
        durationMs: 12_000,
        onUpdate: (p) => setDriverPos({ lat: p.latitude, lng: p.longitude }),
      });
      animator.start();
      return () => animator.stop();
    }

    setDriverPos(ride.status === "completed" ? dropoff : driverStart);
  }, [
    ride.status,
    ride.driverLiveLocation,
    polyline,
    pickupLeg,
    mode,
    dropoff,
    driverStart,
  ]);

  const routePreview = useMemo(() => {
    const line =
      mode === "to_pickup" && pickupLeg.length ? pickupLeg : polyline;
    if (!line.length) return null;
    return {
      source: "demo_seed" as const,
      distanceKm: ride.fareEstimate?.distanceKm ?? 0,
      durationMinutes: ride.fareEstimate?.durationMinutes ?? 0,
      polyline: line,
    };
  }, [mode, pickupLeg, polyline, ride.fareEstimate]);

  const fitPoints =
    mode === "to_pickup"
      ? [driverStart, pickup]
      : [pickup, dropoff];

  return (
    <div className="h-full min-h-[45dvh] overflow-hidden bg-slate-950">
      <MapView fitPoints={fitPoints}>
        <PickupSelector position={pickup} />
        {mode === "trip" && <DestinationSelector position={dropoff} />}
        <RoutePreviewLayer route={routePreview} />
        {driverPos && <DriverMarker position={driverPos} />}
      </MapView>
    </div>
  );
}

export function TripMapPanel({
  ride,
  mode = "trip",
}: {
  ride: Ride;
  mode?: MapMode;
}) {
  return (
    <MapProvider>
      <Inner ride={ride} mode={mode} />
    </MapProvider>
  );
}
