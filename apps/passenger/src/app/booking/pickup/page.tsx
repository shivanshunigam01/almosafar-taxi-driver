"use client";

import { DEMO_LOCATIONS } from "@almosafar/shared";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function PickupPage() {
  const { setPickup } = useBooking();
  const router = useRouter();
  return (
    <div className="space-y-3 px-4 py-6">
      <h1 className="text-lg font-bold">Pickup location</h1>
      {DEMO_LOCATIONS.map((loc) => (
        <button
          key={loc.label}
          type="button"
          className="block w-full rounded-xl border bg-white p-4 text-start"
          onClick={() => {
            setPickup(loc);
            router.push("/home");
          }}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
