"use client";

import Link from "next/link";
import { getDemoSeedBundle } from "@almosafar/shared";
import { notifyUser } from "@almosafar/ui";
import { useBooking } from "@/context/BookingContext";

export default function PaymentsPage() {
  const seed = getDemoSeedBundle();
  const { booking, setPaymentMethodId } = useBooking();

  return (
    <div className="space-y-3 bg-slate-50 px-4 py-6 pb-24">
      <Link href="/home/profile" className="text-sm text-brand">
        ← Profile
      </Link>
      <h1 className="text-xl font-bold text-slate-900">Payment methods (simulation)</h1>
      <p className="text-sm text-slate-600">No real cards stored. Demo labels only.</p>
      {seed.paymentMethods.map((pm) => (
        <button
          key={pm.id}
          type="button"
          className={`block w-full rounded-xl border p-4 text-start font-medium transition ${
            booking.paymentMethodId === pm.id
              ? "border-brand bg-blue-50 ring-2 ring-brand/20"
              : "border-slate-200 bg-white hover:border-teal-400"
          }`}
          onClick={() => {
            setPaymentMethodId(pm.id);
            notifyUser(`Default payment set to: ${pm.label}`);
          }}
        >
          {pm.label}
        </button>
      ))}
      <Link
        href="/booking/confirm"
        className="mt-4 block rounded-xl bg-brand py-3 text-center font-semibold text-white"
      >
        Continue to booking
      </Link>
    </div>
  );
}
