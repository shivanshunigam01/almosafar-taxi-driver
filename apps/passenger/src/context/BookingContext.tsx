"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Address } from "@almosafar/shared";
import type { VehicleCategory } from "@almosafar/shared";
import { DEMO_LOCATIONS, getDemoSeedBundle } from "@almosafar/shared";
import type { RouteResult } from "@almosafar/maps";

const KEY = "almosafar.passenger.booking";

type SavedPlaces = {
  home?: Address;
  work?: Address;
};

type BookingState = {
  pickup: Address | null;
  dropoff: Address | null;
  category: VehicleCategory;
  paymentMethodId: string;
  route: RouteResult | null;
  recentDestinations: Address[];
  saved: SavedPlaces;
};

const defaultState = (): BookingState => {
  const seed = getDemoSeedBundle();
  return {
    pickup: DEMO_LOCATIONS[2] ?? null,
    dropoff: DEMO_LOCATIONS[1] ?? null,
    category: "economy",
    paymentMethodId: seed.paymentMethods[0]?.id ?? "pm-demo",
    route: null,
    recentDestinations: DEMO_LOCATIONS.slice(0, 3),
    saved: {
      home: DEMO_LOCATIONS[2],
      work: DEMO_LOCATIONS[1],
    },
  };
};

const BookingContext = createContext<{
  booking: BookingState;
  setPickup: (a: Address) => void;
  setDropoff: (a: Address) => void;
  setCategory: (c: VehicleCategory) => void;
  setPaymentMethodId: (id: string) => void;
  setRoute: (route: RouteResult | null) => void;
  addRecentDestination: (a: Address) => void;
  setSavedPlace: (kind: "home" | "work", a: Address) => void;
  reset: () => void;
} | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultState);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setBooking({ ...defaultState(), ...JSON.parse(raw) });
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(booking));
  }, [booking]);

  return (
    <BookingContext.Provider
      value={{
        booking,
        setPickup: (pickup) => setBooking((b) => ({ ...b, pickup, route: null })),
        setDropoff: (dropoff) => setBooking((b) => ({ ...b, dropoff, route: null })),
        setCategory: (category) => setBooking((b) => ({ ...b, category })),
        setPaymentMethodId: (paymentMethodId) =>
          setBooking((b) => ({ ...b, paymentMethodId })),
        setRoute: (route) => setBooking((b) => ({ ...b, route })),
        addRecentDestination: (a) =>
          setBooking((b) => ({
            ...b,
            recentDestinations: [
              a,
              ...b.recentDestinations.filter((x) => x.label !== a.label),
            ].slice(0, 8),
          })),
        setSavedPlace: (kind, a) =>
          setBooking((b) => ({ ...b, saved: { ...b.saved, [kind]: a } })),
        reset: () => setBooking(defaultState()),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const c = useContext(BookingContext);
  if (!c) throw new Error("BookingProvider required");
  return c;
}
