"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useRideRepo } from "@/context/RideRepoContext";
import { useLocale } from "@/context/LocaleContext";

export default function TripCompletedPage() {
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const { t } = useLocale();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    repo.getRide(id).then(setRide);
  }, [id, repo]);

  const fare = ride?.fareFinal ?? ride?.fareEstimate;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-teal-600" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {t("Trip complete", "اكتملت الرحلة")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t("Simulated payment — no charge", "دفع تجريبي — بدون خصم فعلي")}
        </p>
      </div>
      {ride && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t("Receipt", "إيصال")}
          </p>
          {fare && (
            <>
              <p className="mt-2 text-3xl font-bold text-teal-800">{formatMoney(fare.total)}</p>
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <li className="flex justify-between">
                  <span>{t("Distance", "المسافة")}</span>
                  <span>{fare.distanceKm.toFixed(1)} km</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Duration", "المدة")}</span>
                  <span>{fare.durationMinutes} min</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Base", "أساس")}</span>
                  <span>{formatMoney(fare.baseFare)}</span>
                </li>
              </ul>
            </>
          )}
          <p className="mt-4 truncate text-xs text-slate-500">
            {ride.pickup.label} → {ride.dropoff.label}
          </p>
        </div>
      )}
      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
        <Link
          href={`/ride/rating/${id}`}
          className="rounded-2xl bg-teal-700 py-3.5 text-center font-semibold text-white shadow-md"
        >
          {t("Rate your driver", "قيّم السائق")}
        </Link>
        <Link href="/home/history" className="rounded-2xl border border-slate-200 py-3 text-center font-medium">
          {t("Trip history", "سجل الرحلات")}
        </Link>
        <Link href="/home" className="text-center text-sm text-teal-700">
          {t("Back to map", "العودة للخريطة")}
        </Link>
      </div>
    </div>
  );
}
