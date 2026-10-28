"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  ChevronUp,
  Home,
  LocateFixed,
  MapPin,
  User,
} from "lucide-react";
import {
  MapProvider,
  MapView,
  useMapServices,
  LocationSearch,
  PickupSelector,
  DestinationSelector,
  RoutePreviewLayer,
  RecenterControl,
  ZoomControls,
  NearbyDriverMarker,
  PassengerMarker,
} from "@almosafar/maps/react";
import type { MapPlace } from "@almosafar/maps";
import { useBooking } from "@/context/BookingContext";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";

function addressFromPlace(p: MapPlace) {
  return { label: p.label, geo: p.geo };
}

function MapHomeInner() {
  const {
    booking,
    setPickup,
    setDropoff,
    setRoute,
    addRecentDestination,
    setSavedPlace,
  } = useBooking();
  const { geolocation, routing } = useMapServices();
  const { t, locale, setLocale } = useLocale();
  const { session } = useAuth();
  const router = useRouter();
  const [sheet, setSheet] = useState<"collapsed" | "expanded" | "pickup" | "dropoff">(
    "collapsed"
  );
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    if (!geolocation.isSupported()) {
      setGpsError(t("GPS unavailable — using Baghdad demo area", "GPS غير متاح — منطقة بغداد التجريبية"));
      return;
    }
    geolocation
      .getCurrentPosition()
      .then((pos) => setGps({ lat: pos.latitude, lng: pos.longitude }))
      .catch(() =>
        setGpsError(t("Location permission denied", "تم رفض إذن الموقع"))
      );
    return geolocation.watchPosition(
      (pos) => setGps({ lat: pos.latitude, lng: pos.longitude }),
      (msg) => setGpsError(msg)
    );
  }, [geolocation, t]);

  const pickupLatLng = useMemo(
    () =>
      booking.pickup
        ? { lat: booking.pickup.geo.latitude, lng: booking.pickup.geo.longitude }
        : null,
    [booking.pickup]
  );
  const dropLatLng = useMemo(
    () =>
      booking.dropoff
        ? { lat: booking.dropoff.geo.latitude, lng: booking.dropoff.geo.longitude }
        : null,
    [booking.dropoff]
  );

  const mapCenter = pickupLatLng ?? gps ?? { lat: 33.3152, lng: 44.3661 };

  const nearbyDrivers = useMemo(() => {
    const base = mapCenter;
    return [
      { lat: base.lat + 0.004, lng: base.lng - 0.003 },
      { lat: base.lat - 0.003, lng: base.lng + 0.005 },
      { lat: base.lat + 0.002, lng: base.lng + 0.004 },
    ];
  }, [mapCenter]);

  const loadRoute = useCallback(async () => {
    if (!booking.pickup || !booking.dropoff) return;
    setRouteLoading(true);
    setRouteError(null);
    try {
      const result = await routing.route(booking.pickup.geo, booking.dropoff.geo);
      setRoute(result);
    } catch {
      setRouteError(t("Could not load route", "تعذّر تحميل المسار"));
    } finally {
      setRouteLoading(false);
    }
  }, [booking.pickup, booking.dropoff, routing, setRoute, t]);

  useEffect(() => {
    if (booking.pickup && booking.dropoff) void loadRoute();
  }, [booking.pickup, booking.dropoff, loadRoute]);

  const fitPoints = [
    ...(pickupLatLng ? [pickupLatLng] : []),
    ...(dropLatLng ? [dropLatLng] : []),
    ...(gps ? [gps] : []),
  ];

  const onSelectDropoff = (place: MapPlace) => {
    const addr = addressFromPlace(place);
    setDropoff(addr);
    addRecentDestination(addr);
    setSheet("collapsed");
    router.push("/booking/route");
  };

  return (
    <div className="relative h-[calc(100dvh-6.5rem)] w-full">
      <div className="absolute inset-0 z-0">
        <MapView center={mapCenter} fitPoints={fitPoints.length ? fitPoints : undefined}>
          {gps && <PassengerMarker position={gps} />}
          {pickupLatLng && (
            <PickupSelector
              position={pickupLatLng}
              onDragEnd={(lat, lng) =>
                setPickup({
                  label: t("Map pickup", "انطلاق من الخريطة"),
                  geo: { latitude: lat, longitude: lng },
                })
              }
            />
          )}
          {dropLatLng && (
            <DestinationSelector
              position={dropLatLng}
              onDragEnd={(lat, lng) =>
                setDropoff({
                  label: t("Map destination", "وجهة من الخريطة"),
                  geo: { latitude: lat, longitude: lng },
                })
              }
            />
          )}
          {nearbyDrivers.map((d, i) => (
            <NearbyDriverMarker key={i} position={d} />
          ))}
          <RoutePreviewLayer route={booking.route} />
          <RecenterControl target={mapCenter} />
          <ZoomControls />
        </MapView>
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <span className="text-sm font-bold text-brand">Almosafar</span>
          <span className="text-xs text-slate-500">Taxi</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-white/95 p-2 shadow-lg"
            aria-label="Notifications"
            onClick={() => router.push("/notifications")}
          >
            <Bell className="h-5 w-5 text-slate-700" />
          </button>
          <Link
            href="/home/profile"
            className="rounded-full bg-white/95 p-2 shadow-lg"
            aria-label="Profile"
          >
            <User className="h-5 w-5 text-slate-700" />
          </Link>
          <button
            type="button"
            className="rounded-full bg-brand px-2 py-1 text-xs font-semibold text-white shadow-lg"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
        </div>
      </header>

      {gpsError && (
        <p className="absolute left-3 right-3 top-16 z-20 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow">
          {gpsError}
        </p>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 z-50 mx-auto max-w-lg pb-[calc(4rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
          sheet === "expanded" || sheet === "pickup" || sheet === "dropoff"
            ? "translate-y-0"
            : "translate-y-[calc(100%-11rem)]"
        }`}
      >
        <div className="rounded-t-3xl bg-white px-4 pb-6 pt-2 shadow-[0_-8px_30px_rgba(0,0,0,.12)]">
          <button
            type="button"
            className="mx-auto mb-3 flex w-full justify-center py-1"
            aria-label="Expand sheet"
            onClick={() =>
              setSheet((s) => (s === "collapsed" ? "expanded" : "collapsed"))
            }
          >
            <ChevronUp className="h-6 w-6 text-slate-400" />
          </button>

          <button
            type="button"
            className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-slate-100 px-4 py-4 text-left"
            onClick={() => setSheet("dropoff")}
          >
            <MapPin className="h-5 w-5 text-brand" />
            <div>
              <p className="text-xs text-slate-500">{t("Where to?", "إلى أين؟")}</p>
              <p className="font-semibold text-slate-900">
                {booking.dropoff?.label ?? t("Choose destination", "اختر الوجهة")}
              </p>
            </div>
          </button>

          <button
            type="button"
            className="mb-2 flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            onClick={() => setSheet("pickup")}
          >
            <LocateFixed className="h-4 w-4 text-slate-500" />
            <span className="truncate text-slate-600">
              {booking.pickup?.label ?? t("Pickup", "الانطلاق")}
            </span>
          </button>
          <div className="mb-3 flex gap-2 text-xs">
            <Link
              href="/booking/pickup"
              className="flex-1 rounded-lg border border-slate-200 py-2 text-center font-medium text-brand"
            >
              {t("Pick on list", "اختر من القائمة")}
            </Link>
            <Link
              href="/booking/destination"
              className="flex-1 rounded-lg border border-slate-200 py-2 text-center font-medium text-brand"
            >
              {t("Destination list", "قائمة الوجهات")}
            </Link>
          </div>

          {(sheet === "pickup" || sheet === "dropoff") && (
            <div className="mb-4">
              <LocationSearch
                placeholder={
                  sheet === "pickup"
                    ? t("Search pickup", "ابحث عن الانطلاق")
                    : t("Search destination", "ابحث عن الوجهة")
                }
                onSelect={(place) => {
                  if (sheet === "pickup") {
                    setPickup(addressFromPlace(place));
                    setSheet("collapsed");
                  } else {
                    onSelectDropoff(place);
                  }
                }}
                autoFocus
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-700"
                  onClick={() => {
                    const target =
                      sheet === "pickup" ? booking.pickup : booking.dropoff;
                    if (!target) return;
                    setSavedPlace("home", target);
                  }}
                >
                  {t("Save as Home", "حفظ كالمنزل")}
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-700"
                  onClick={() => {
                    const target =
                      sheet === "pickup" ? booking.pickup : booking.dropoff;
                    if (!target) return;
                    setSavedPlace("work", target);
                  }}
                >
                  {t("Save as Work", "حفظ كالعمل")}
                </button>
              </div>
            </div>
          )}

          {(sheet === "expanded" || sheet === "collapsed") && booking.recentDestinations.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(["home", "work"] as const).map((kind) => {
                  const place = booking.saved[kind];
                  if (!place) return null;
                  const Icon = kind === "home" ? Home : Briefcase;
                  return (
                    <button
                      key={kind}
                      type="button"
                      className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left active:border-brand"
                      onClick={() =>
                        onSelectDropoff({
                          label: place.label,
                          geo: place.geo,
                          source: "saved",
                        })
                      }
                    >
                      <span className="flex items-center gap-1 text-sm font-semibold capitalize text-slate-900">
                        <Icon className="h-4 w-4 text-brand" />
                        {t(kind, kind === "home" ? "المنزل" : "العمل")}
                      </span>
                      <span className="line-clamp-2 text-xs text-slate-500">{place.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("Recent", "الأخيرة")}
              </p>
              {booking.recentDestinations.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  className="block w-full truncate rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() =>
                    onSelectDropoff({ label: d.label, geo: d.geo, source: "preset" })
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {booking.pickup && booking.dropoff && (
            <div className="mt-2 space-y-2 border-t border-slate-100 pt-3">
              {routeLoading && (
                <p className="text-xs text-slate-500">{t("Calculating route…", "جاري حساب المسار…")}</p>
              )}
              {booking.route && (
                <p className="text-xs text-slate-600">
                  {booking.route.distanceKm.toFixed(1)} km · ~{booking.route.durationMinutes}{" "}
                  min
                  {booking.route.warning ? ` · ${booking.route.warning}` : ""}
                </p>
              )}
              {routeError && <p className="text-xs text-red-600">{routeError}</p>}
              <Link
                href="/booking/route"
                className="btn-brand block"
              >
                {t("Choose ride", "اختر الرحلة")}
              </Link>
            </div>
          )}

          {!session && (
            <Link href="/login" className="mt-2 block text-center text-sm text-brand underline">
              {t("Sign in to book", "سجّل الدخول للحجز")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function MapHomeClient() {
  return (
    <MapProvider>
      <MapHomeInner />
    </MapProvider>
  );
}
