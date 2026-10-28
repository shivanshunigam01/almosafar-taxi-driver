"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Briefcase } from "lucide-react";
import { DEMO_LOCATIONS } from "@almosafar/shared";
import { LocationSearch, MapProvider } from "@almosafar/maps/react";
import type { MapPlace } from "@almosafar/maps";
import { useBooking } from "@/context/BookingContext";
import { useLocale } from "@/context/LocaleContext";

export default function DestinationPage() {
  const { booking, setDropoff, setSavedPlace, addRecentDestination } = useBooking();
  const router = useRouter();
  const { t } = useLocale();

  const apply = (place: MapPlace) => {
    const addr = { label: place.label, geo: place.geo };
    setDropoff(addr);
    addRecentDestination(addr);
    router.push("/booking/route");
  };

  return (
    <MapProvider>
      <div className="space-y-4 bg-slate-50 px-4 py-6 pb-24">
        <Link href="/home" className="text-sm font-medium text-brand">
          ← {t("Map", "الخريطة")}
        </Link>
        <h1 className="text-xl font-bold text-slate-900">{t("Choose destination", "اختر الوجهة")}</h1>
        <LocationSearch
          placeholder={t("Where to?", "إلى أين؟")}
          onSelect={apply}
          autoFocus
        />
        <div className="flex gap-2">
          {(["home", "work"] as const).map((kind) => {
            const place = booking.saved[kind];
            if (!place) return null;
            const Icon = kind === "home" ? Home : Briefcase;
            return (
              <button
                key={kind}
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium"
                onClick={() => apply({ label: place.label, geo: place.geo, source: "saved" })}
              >
                <Icon className="h-4 w-4 text-brand" />
                {t(kind, kind === "home" ? "المنزل" : "العمل")}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t("Suggested", "مقترح")}
        </p>
        {DEMO_LOCATIONS.map((loc) => (
          <button
            key={loc.label}
            type="button"
            className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm hover:border-brand"
            onClick={() => apply({ label: loc.label, geo: loc.geo, source: "preset" })}
          >
            {loc.label}
          </button>
        ))}
        {booking.dropoff && (
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl bg-slate-200 py-2 text-xs font-semibold"
              onClick={() => setSavedPlace("home", booking.dropoff!)}
            >
              {t("Set as Home", "حفظ كالمنزل")}
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-slate-200 py-2 text-xs font-semibold"
              onClick={() => setSavedPlace("work", booking.dropoff!)}
            >
              {t("Set as Work", "حفظ كالعمل")}
            </button>
          </div>
        )}
      </div>
    </MapProvider>
  );
}
