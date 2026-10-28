"use client";

import { DEMO_LOCATIONS } from "@almosafar/shared";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function DestinationPage() {
  const { setDropoff } = useBooking();
  const router = useRouter();
  return (
    <div className="space-y-3 px-4 py-6">
      <h1 className="text-lg font-bold">Destination</h1>
      {DEMO_LOCATIONS.map((loc) => (
        <button
          key={loc.label}
          type="button"
          className="block w-full rounded-xl border bg-white p-4 text-start"
          onClick={() => {
            setDropoff(loc);
            router.push("/home");
          }}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
