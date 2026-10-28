"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Wallet } from "lucide-react";
import {
  buildRideRequest,
  estimateTripFare,
  findFareConfiguration,
  formatMoney,
  getDemoSeedBundle,
} from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { useRideRepo } from "@/context/RideRepoContext";
import { useLocale } from "@/context/LocaleContext";

export default function ConfirmBookingPage() {
  const { session } = useAuth();
  const { booking, setPaymentMethodId } = useBooking();
  const repo = useRideRepo();
  const router = useRouter();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const seed = getDemoSeedBundle();

  if (!session || !booking.pickup || !booking.dropoff) {
    return <p className="p-4">{t("Missing session or locations.", "بيانات ناقصة.")}</p>;
  }

  const fareConfig = findFareConfiguration(
    seed.fareConfigurations,
    seed.zone.id,
    booking.category
  )!;
  const fare = estimateTripFare({
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    fareConfig,
    distanceKm: booking.route?.distanceKm,
    durationMinutes: booking.route?.durationMinutes,
  });

  return (
    <div className="space-y-5 bg-slate-50 px-4 py-6 pb-28">
      <Link href="/booking/route" className="text-sm font-medium text-brand">
        ← {t("Back", "رجوع")}
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">{t("Confirm ride", "تأكيد الرحلة")}</h1>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase text-slate-500">{t("Route", "المسار")}</p>
        <p className="mt-1 font-medium">{booking.pickup.label}</p>
        <p className="text-slate-600">↓ {booking.dropoff.label}</p>
        <p className="mt-3 text-sm text-slate-500">
          {fare.distanceKm.toFixed(1)} km · ~{fare.durationMinutes} min ·{" "}
          <span className="capitalize">{booking.category}</span>
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase text-slate-500">{t("Fare estimate", "تقدير الأجرة")}</p>
        <p className="mt-1 text-2xl font-bold text-brand-dark">{formatMoney(fare.total)}</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>{t("Base", "أساس")}: {formatMoney(fare.baseFare)}</li>
          <li>{t("Distance", "مسافة")}: {formatMoney(fare.distanceComponent)}</li>
          <li>{t("Time", "وقت")}: {formatMoney(fare.timeComponent)}</li>
        </ul>
        <p className="mt-2 text-xs text-amber-700">{t("Simulated payment — no real charge", "دفع تجريبي")}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-800">
          {t("Payment method", "طريقة الدفع")}
        </p>
        <div className="space-y-2">
          {seed.paymentMethods.map((pm) => {
            const Icon =
              pm.type === "cash" ? Banknote : pm.type.includes("wallet") ? Wallet : CreditCard;
            const selected = booking.paymentMethodId === pm.id;
            return (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethodId(pm.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${
                  selected ? "border-brand bg-blue-50 ring-2 ring-brand/20" : "border-slate-200 bg-white"
                }`}
              >
                <Icon className="h-5 w-5 text-brand" />
                <span className="font-medium">{pm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={busy}
        className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-brand py-4 text-lg font-bold text-white shadow-xl disabled:opacity-50"
        onClick={async () => {
          setBusy(true);
          const ride = buildRideRequest({
            passengerId: session.passengerId,
            zoneId: seed.zone.id,
            category: booking.category,
            pickup: booking.pickup!,
            dropoff: booking.dropoff!,
            fareEstimate: fare,
            paymentMethodId: booking.paymentMethodId,
          });
          await repo.createRideRequest(ride);
          repo.startLocalDriverSimulation?.(ride.id);
          router.push(`/ride/searching/${ride.id}`);
        }}
      >
        {busy ? t("Booking…", "جاري الحجز…") : t("Confirm ride", "تأكيد الرحلة")}
      </button>
    </div>
  );
}
