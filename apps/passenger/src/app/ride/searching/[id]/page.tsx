"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car } from "lucide-react";
import { useRideRepo } from "@/context/RideRepoContext";
import { useLocale } from "@/context/LocaleContext";

export default function SearchingPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const repo = useRideRepo();
  const router = useRouter();

  useEffect(() => {
    return repo.subscribeRide(id, (ride) => {
      if (!ride) return;
      if (ride.status === "cancelled" || ride.status === "rejected") router.replace("/home");
      if (["accepted", "driver_arriving", "in_progress", "completed"].includes(ride.status)) {
        router.replace(`/ride/active/${id}`);
      }
    });
  }, [id, repo, router]);

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-slate-900 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0d9488_0%,_transparent_55%)] opacity-40" />
      <div className="relative flex h-40 w-40 items-center justify-center">
        <span className="absolute h-32 w-32 animate-pulse-ring rounded-full bg-teal-500/30" />
        <span className="absolute h-24 w-24 animate-pulse-ring rounded-full bg-teal-400/40 [animation-delay:0.4s]" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 shadow-lg shadow-teal-900/50">
          <Car className="h-8 w-8" aria-hidden />
        </div>
      </div>
      <h1 className="relative mt-8 text-xl font-bold">{t("Finding your driver", "جاري البحث عن سائق")}</h1>
      <p className="relative mt-2 max-w-xs text-center text-sm text-slate-300">
        {t(
          "Simulated matching on this device — usually a few seconds.",
          "مطابقة تجريبية على هذا الجهاز — عادة بضع ثوانٍ."
        )}
      </p>
    </div>
  );
}
