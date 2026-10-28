"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { getDemoSeedBundle, type Ride } from "@almosafar/shared";
import { Phone, MessageCircle } from "lucide-react";
import { useRideRepo } from "@/context/RideRepoContext";
import { useLocale } from "@/context/LocaleContext";

const ActiveRideMapClient = dynamic(
  () => import("@/components/ActiveRideMapClient").then((m) => m.ActiveRideMapClient),
  { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-2xl bg-slate-200" /> }
);

export default function ActiveRidePage() {
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const { t } = useLocale();
  const [ride, setRide] = useState<Ride | null>(null);
  const seed = getDemoSeedBundle();

  useEffect(() => {
    return repo.subscribeRide(id, setRide);
  }, [id, repo]);

  const driver = useMemo(() => {
    if (!ride?.driverId) return null;
    return seed.drivers.find((d) => d.id === ride.driverId) ?? null;
  }, [ride?.driverId, seed.drivers]);

  const vehicle = useMemo(() => {
    if (!ride?.vehicleId) return null;
    return seed.vehicles.find((v) => v.id === ride.vehicleId) ?? null;
  }, [ride?.vehicleId, seed.vehicles]);

  if (!ride) return <p className="p-4">{t("Loading…", "جاري التحميل…")}</p>;
  if (ride.status === "completed") {
    return (
      <div className="space-y-4 p-4">
        <p>{t("Trip completed.", "اكتملت الرحلة.")}</p>
        <Link href={`/ride/completed/${id}`} className="text-teal-700 underline">
          {t("View receipt", "عرض الإيصال")}
        </Link>
      </div>
    );
  }

  const statusLabel =
    ride.status === "in_progress"
      ? t("On trip", "في الرحلة")
      : ride.status === "driver_arriving"
        ? t("Meet at pickup", "التقِ عند نقطة الانطلاق")
        : ride.status === "accepted"
          ? t("Driver assigned", "تم تعيين السائق")
          : ride.status.replace(/_/g, " ");

  return (
    <div className="space-y-4 px-4 py-6 pb-24">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-teal-500 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-600" />
        </span>
        <h1 className="text-lg font-bold capitalize">{statusLabel}</h1>
      </div>
      <p className="text-xs text-slate-500">
        {t("Track your driver on the map (local demo on this site)", "تتبّع السائق على الخريطة (تجريبي)")}
      </p>
      <ActiveRideMapClient ride={ride} />

      {(ride.status === "driver_arriving" || ride.status === "accepted") && ride.demoPassengerPin && (
        <div className="rounded-2xl border-2 border-teal-600 bg-teal-50 p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-teal-900">
            {t("Give this code to your driver", "أعطِ هذا الرمز للسائق")}
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tracking-[0.35em] text-teal-800">
            {ride.demoPassengerPin}
          </p>
          <p className="mt-2 text-xs text-teal-700/80">
            {t("Shown when the driver arrives at pickup", "يظهر عند وصول السائق لنقطة الالتقاط")}
          </p>
        </div>
      )}
      {driver && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">{driver.displayName}</p>
          <p className="text-sm text-slate-600">
            ★ {(driver.ratingAverage ?? 4.9).toFixed(1)} · {t("ETA demo", "وقت وصول تجريبي")} ~5 min
          </p>
          {vehicle && (
            <p className="text-sm text-slate-600">
              {vehicle.make} {vehicle.model} · {vehicle.plateNumber}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-sm"
              onClick={() => alert(t("Demo call — no telephony", "اتصال تجريبي"))}
            >
              <Phone className="h-4 w-4" /> {t("Call", "اتصال")}
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-sm"
              onClick={() => alert(t("Demo message", "رسالة تجريبية"))}
            >
              <MessageCircle className="h-4 w-4" /> {t("Message", "رسالة")}
            </button>
          </div>
        </div>
      )}
      {ride.status === "in_progress" && ride.fareEstimate && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {t("En route to destination", "في الطريق إلى الوجهة")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            ~{ride.fareEstimate.durationMinutes} {t("min", "د")} ·{" "}
            {ride.fareEstimate.distanceKm.toFixed(1)} km
          </p>
        </div>
      )}
      <p className="text-sm text-slate-600">
        {ride.pickup.label} → {ride.dropoff.label}
      </p>
      <Link href={`/ride/cancel/${id}`} className="block text-center text-red-600">
        {t("Cancel ride", "إلغاء الرحلة")}
      </Link>
    </div>
  );
}
