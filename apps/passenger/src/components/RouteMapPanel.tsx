"use client";

import { useEffect } from "react";
import {
  MapProvider,
  MapView,
  RoutePreviewLayer,
  PickupSelector,
  DestinationSelector,
  useMapServices,
} from "@almosafar/maps/react";
import { useBooking } from "@/context/BookingContext";

function Inner() {
  const { booking, setRoute } = useBooking();
  const { routing } = useMapServices();

  useEffect(() => {
    if (!booking.pickup || !booking.dropoff) return;
    if (booking.route) return;
    void routing.route(booking.pickup.geo, booking.dropoff.geo).then(setRoute);
  }, [booking.pickup, booking.dropoff, booking.route, routing, setRoute]);

  if (!booking.pickup || !booking.dropoff) return null;

  const pickup = {
    lat: booking.pickup.geo.latitude,
    lng: booking.pickup.geo.longitude,
  };
  const dropoff = {
    lat: booking.dropoff.geo.latitude,
    lng: booking.dropoff.geo.longitude,
  };

  return (
    <div className="h-52 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapView fitPoints={[pickup, dropoff]}>
        <PickupSelector position={pickup} />
        <DestinationSelector position={dropoff} />
        <RoutePreviewLayer route={booking.route} />
      </MapView>
    </div>
  );
}

export function RouteMapPanel() {
  return (
    <MapProvider>
      <Inner />
    </MapProvider>
  );
}
