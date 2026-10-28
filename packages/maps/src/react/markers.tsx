"use client";

import { Marker } from "react-leaflet";
import type { LatLng } from "../types";
import {
  defaultPinIcon,
  driverIcon,
  dropoffIcon,
  pickupIcon,
  userLocationIcon,
} from "./icons";
function dragProps(onDragEnd: (lat: number, lng: number) => void) {
  return {
    draggable: true,
    eventHandlers: {
      dragend: (e: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
        const { lat, lng } = e.target.getLatLng();
        onDragEnd(lat, lng);
      },
    },
  };
}

export function PassengerMarker({ position }: { position: LatLng }) {
  return <Marker position={[position.lat, position.lng]} icon={userLocationIcon} />;
}

export function PickupSelector({
  position,
  onDragEnd,
}: {
  position: LatLng;
  onDragEnd?: (lat: number, lng: number) => void;
}) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={pickupIcon}
      {...(onDragEnd ? dragProps(onDragEnd) : {})}
    />
  );
}

export function DestinationSelector({
  position,
  onDragEnd,
}: {
  position: LatLng;
  onDragEnd?: (lat: number, lng: number) => void;
}) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={dropoffIcon}
      {...(onDragEnd ? dragProps(onDragEnd) : {})}
    />
  );
}

export function DriverMarker({
  position,
}: {
  position: LatLng;
  headingDeg?: number;
}) {
  return (
    <Marker position={[position.lat, position.lng]} icon={driverIcon} />
  );
}

export function NearbyDriverMarker({ position }: { position: LatLng }) {
  return <Marker position={[position.lat, position.lng]} icon={defaultPinIcon} />;
}
