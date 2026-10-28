"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car, Loader2 } from "lucide-react";
import type { Ride } from "@almosafar/shared";
import { useRideRepo } from "@/context/RideRepoContext";
import { useLocale } from "@/context/LocaleContext";

export default function SearchingPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    return repo.subscribeRide(id, (r) => {
      setRide(r);
      if (!r) return;
      if (r.status === "cancelled" || r.status === "rejected") router.replace("/home");
      if (["accepted", "driver_arriving", "in_progress", "completed"].includes(r.status)) {
        router.replace(`/ride/active/${id}`);
      }
    });
  }, [id, repo, router]);

  const phase =
    ride?.status === "requested"
      ? t("Waiting for driver to accept…", "بانتظار قبول السائق…")
      : t("Finding your driver", "جاري البحث عن سائق");

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-[#0c1222] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2563eb_0%,_transparent_55%)] opacity-35" />
      <div className="relative flex h-44 w-44 items-center justify-center">
        <span className="absolute h-36 w-36 animate-pulse-ring rounded-full bg-blue-500/25" />
        <span className="absolute h-28 w-28 animate-pulse-ring rounded-full bg-blue-400/30 [animation-delay:0.35s]" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand shadow-lg shadow-blue-900/40">
          <Car className="h-9 w-9" aria-hidden />
        </div>
        <Loader2 className="absolute -bottom-2 h-10 w-10 animate-spin text-blue-300" aria-hidden />
      </div>
      <h1 className="relative mt-10 text-center text-xl font-bold">{phase}</h1>
      <p className="relative mt-3 max-w-xs text-center text-sm text-slate-300">
        {t(
          "Your request is live on this device. A demo driver usually accepts in a few seconds.",
          "طلبك نشط على هذا الجهاز. عادة يقبل السائق التجريبي خلال ثوانٍ."
        )}
      </p>
      <div className="relative mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-slate-200">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        {t("Matching nearby drivers (simulated)", "مطابقة سائقين قريبين (تجريبي)")}
      </div>
    </div>
  );
}
