"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Car, Users, Crown, Sparkles } from "lucide-react";
import {
  estimateTripFare,
  findFareConfiguration,
  formatMoney,
  getDemoSeedBundle,
  VEHICLE_CATEGORY_LABELS,
  type VehicleCategory,
} from "@almosafar/shared";
import { useBooking } from "@/context/BookingContext";
import { useLocale } from "@/context/LocaleContext";

const RouteMap = dynamic(
  () => import("@/components/RouteMapPanel").then((m) => m.RouteMapPanel),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-slate-200" /> }
);

const categories = ["economy", "comfort", "xl", "premium"] as const satisfies readonly VehicleCategory[];

const icons = {
  economy: Car,
  comfort: Sparkles,
  xl: Users,
  premium: Crown,
} as const;

const etaMin = {
  economy: 4,
  comfort: 3,
  xl: 6,
  premium: 5,
} as const;

export default function RoutePreviewPage() {
  const { booking, setCategory } = useBooking();
  const { t } = useLocale();
  const seed = getDemoSeedBundle();
  if (!booking.pickup || !booking.dropoff) {
    return <p className="p-4">{t("Set pickup and destination first.", "حدّد الانطلاق والوجهة أولاً.")}</p>;
  }

  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6 pb-24">
      <Link href="/home" className="text-sm font-medium text-brand">
        ← {t("Map", "الخريطة")}
      </Link>
      <h1 className="text-xl font-bold text-slate-900">{t("Choose a ride", "اختر الرحلة")}</h1>
      <RouteMap />
      <div className="space-y-2">
        {categories.map((c) => {
          const fareConfig = findFareConfiguration(seed.fareConfigurations, seed.zone.id, c);
          const fare = fareConfig
            ? estimateTripFare({
                pickup: booking.pickup!,
                dropoff: booking.dropoff!,
                fareConfig,
                distanceKm: booking.route?.distanceKm,
                durationMinutes: booking.route?.durationMinutes,
              })
            : null;
          const Icon = icons[c];
          const selected = booking.category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                selected
                  ? "border-brand bg-blue-50 ring-2 ring-brand/25"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selected ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold capitalize text-slate-900">
                  {VEHICLE_CATEGORY_LABELS[c]?.en ?? c}
                </p>
                <p className="text-xs text-slate-500">
                  {etaMin[c]} min away · {booking.route?.distanceKm.toFixed(1) ?? "—"} km
                </p>
              </div>
              {fare && (
                <p className="text-lg font-bold text-slate-900">{formatMoney(fare.total)}</p>
              )}
            </button>
          );
        })}
      </div>
      <Link href="/booking/confirm" className="btn-brand block">
        {t("Continue", "متابعة")}
      </Link>
    </div>
  );
}
