"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Phone, User } from "lucide-react";
import {
  MapProvider,
  MapView,
  PassengerMarker,
  RecenterControl,
  ZoomControls,
  PickupSelector,
  DestinationSelector,
  RoutePreviewLayer,
  useMapServices,
} from "@almosafar/maps/react";
import type { Ride } from "@almosafar/shared";
import {
  computeDriverEarnings,
  formatMoney,
  getDemoSeedBundle,
} from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";
import { useRideRepo } from "@/context/RideRepoContext";
import { useIncomingRideAlert } from "@/hooks/useIncomingRideAlert";

function kmBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function DashboardInner() {
  const { session, logout } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();
  const { geolocation, routing } = useMapServices();
  const [serviceStarted, setServiceStarted] = useState(false);
  const [open, setOpen] = useState<Ride[]>([]);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [starting, setStarting] = useState(false);
  const [readyChecked, setReadyChecked] = useState(false);
  const seed = getDemoSeedBundle();

  const pending = open[0] ?? null;
  const { unlockSound } = useIncomingRideAlert(pending, serviceStarted);

  useEffect(() => {
    return repo.subscribeOpenRideRequests(setOpen);
  }, [repo]);

  useEffect(() => {
    if (!geolocation.isSupported()) return;
    return geolocation.watchPosition((pos) =>
      setGps({ lat: pos.latitude, lng: pos.longitude })
    );
  }, [geolocation]);

  useEffect(() => {
    if (!pending || !serviceStarted) return;
    setCountdown(30);
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [pending?.id, serviceStarted, pending]);

  useEffect(() => {
    if (countdown === 0 && pending && session) {
      void repo.rejectRideAsDriver({
        rideId: pending.id,
        driverId: session.driverId,
        note: "Timed out (demo)",
      });
    }
  }, [countdown, pending, repo, session]);

  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [legToPickup, setLegToPickup] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!pending) return;
    void routing
      .route(pending.pickup.geo, pending.dropoff.geo)
      .then((r) => setRoutePolyline(r.polyline));
    const driverGeo = gps
      ? { latitude: gps.lat, longitude: gps.lng }
      : pending.pickup.geo;
    void routing.route(driverGeo, pending.pickup.geo).then((r) => setLegToPickup(r.polyline));
  }, [pending, routing, gps]);

  const passenger = useMemo(() => {
    if (!pending) return null;
    return seed.passengers.find((p) => p.id === pending.passengerId) ?? null;
  }, [pending, seed.passengers]);

  const pickupDistanceKm = useMemo(() => {
    if (!pending || !gps) return null;
    return kmBetween(gps, {
      lat: pending.pickup.geo.latitude,
      lng: pending.pickup.geo.longitude,
    });
  }, [pending, gps]);

  const todayEarnings = useMemo(() => {
    if (!session) return null;
    const gross = pending?.fareEstimate?.total;
    return gross ? computeDriverEarnings(gross) : null;
  }, [pending, session]);

  const center = gps ?? { lat: 33.3152, lng: 44.3661 };

  if (!session) return null;

  const driver = seed.drivers.find((d) => d.id === session.driverId);

  const startService = async () => {
    if (starting || serviceStarted) return;
    setStarting(true);
    unlockSound();
    try {
      const near = gps
        ? { latitude: gps.lat, longitude: gps.lng }
        : { latitude: center.lat, longitude: center.lng };
      await repo.setDriverOnline(session.driverId, true);
      await repo.ensureLocalDemoDispatchScenario?.(session.driverId, near);
      setServiceStarted(true);
    } finally {
      setStarting(false);
    }
  };

  const stopService = async () => {
    await repo.setDriverOnline(session.driverId, false);
    setServiceStarted(false);
  };

  if (!serviceStarted) {
    return (
      <div className="flex min-h-[calc(100dvh-2rem)] flex-col bg-[#0c1222] px-4 pb-8 pt-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">Dashboard</p>
            <h1 className="text-xl font-bold">{session.name}</h1>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">Offline</span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center">
            <p className="text-xs text-slate-400">Today</p>
            <p className="mt-1 font-bold text-blue-400">—</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center">
            <p className="text-xs text-slate-400">Rating</p>
            <p className="mt-1 font-bold">{(driver?.ratingAverage ?? 4.9).toFixed(1)}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center">
            <p className="text-xs text-slate-400">Vehicle</p>
            <p className="mt-1 text-xs font-medium">Ready</p>
          </div>
        </div>

        <div className="mt-8 flex-1 rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Start your shift</h2>
          <p className="mt-2 text-sm text-slate-400">
            Turn on service to open the live map and receive passenger requests on this device (local
            demo).
          </p>
          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-600 bg-slate-800/80 p-4">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-slate-500 accent-blue-600"
              checked={readyChecked}
              onChange={(e) => setReadyChecked(e.target.checked)}
            />
            <span className="text-sm">I am ready to accept rides</span>
          </label>
          <button
            type="button"
            disabled={starting || !readyChecked}
            className="mt-4 w-full rounded-2xl bg-brand py-4 text-lg font-bold text-white shadow-lg disabled:opacity-50"
            onClick={() => void startService()}
          >
            {starting ? "Starting…" : "Start service"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Link href="/earnings" className="rounded-xl bg-slate-800 py-3 text-center">
            Earnings
          </Link>
          <Link href="/history" className="rounded-xl bg-slate-800 py-3 text-center">
            History
          </Link>
          <Link href="/vehicle" className="rounded-xl bg-slate-800 py-3 text-center">
            Vehicle
          </Link>
          <Link href="/settings" className="rounded-xl bg-slate-800 py-3 text-center">
            Settings
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="mt-6 text-center text-xs text-red-400 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100dvh-2rem)] w-full">
      <div className="absolute inset-0">
        <MapView center={center}>
          {gps && <PassengerMarker position={gps} />}
          {pending && (
            <>
              <PickupSelector
                position={{
                  lat: pending.pickup.geo.latitude,
                  lng: pending.pickup.geo.longitude,
                }}
              />
              <DestinationSelector
                position={{
                  lat: pending.dropoff.geo.latitude,
                  lng: pending.dropoff.geo.longitude,
                }}
              />
              <RoutePreviewLayer
                route={
                  legToPickup.length
                    ? {
                        source: "demo_seed",
                        distanceKm: pickupDistanceKm ?? 1.2,
                        durationMinutes: 4,
                        polyline: legToPickup,
                      }
                    : routePolyline.length
                      ? {
                          source: "demo_seed",
                          distanceKm: pending.fareEstimate?.distanceKm ?? 0,
                          durationMinutes: pending.fareEstimate?.durationMinutes ?? 0,
                          polyline: routePolyline,
                        }
                      : null
                }
              />
            </>
          )}
          <RecenterControl
            target={center}
            className="absolute right-3 bottom-52 z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-blue-400 shadow-lg ring-1 ring-blue-500/30"
          />
          <ZoomControls className="absolute right-3 bottom-64 z-[1000] flex flex-col overflow-hidden rounded-xl bg-slate-900 shadow-lg ring-1 ring-slate-700" />
        </MapView>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between p-3">
        <div className="pointer-events-auto rounded-2xl bg-slate-900/90 px-3 py-2 shadow-lg backdrop-blur">
          <p className="text-xs text-blue-400/90">On duty · Map live</p>
          <p className="font-semibold">{session.name}</p>
        </div>
        <button
          type="button"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg"
          onClick={() => void stopService()}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
          End service
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-3 pb-4">
        <div className="mb-3 grid grid-cols-3 gap-2 rounded-2xl bg-slate-900/95 p-3 text-center text-xs shadow-lg backdrop-blur">
          <div>
            <p className="text-slate-400">Est. fare</p>
            <p className="font-bold text-blue-400">
              {todayEarnings ? formatMoney(todayEarnings.driverNet) : "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Rating</p>
            <p className="font-bold">{(driver?.ratingAverage ?? 4.9).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-slate-400">To pickup</p>
            <p className="font-bold">
              {pickupDistanceKm != null ? `${pickupDistanceKm.toFixed(1)} km` : "—"}
            </p>
          </div>
        </div>

        {pending ? (
          <div className="pointer-events-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">
              New passenger request · {countdown}s
            </p>
            {passenger && (
              <div className="mt-3 flex items-start gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-brand">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{passenger.displayName}</p>
                  <a
                    href={`tel:${passenger.phoneE164 ?? ""}`}
                    className="mt-0.5 flex items-center gap-1 text-sm text-brand"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {passenger.phoneE164 ?? "—"}
                  </a>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Pickup (near you)</p>
                  <p className="font-medium text-slate-900">{pending.pickup.label}</p>
                  {pickupDistanceKm != null && (
                    <p className="text-xs text-slate-500">{pickupDistanceKm.toFixed(1)} km away</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Destination</p>
                  <p className="font-medium text-slate-900">{pending.dropoff.label}</p>
                </div>
              </div>
            </div>
            {pending.fareEstimate && (
              <p className="mt-3 text-sm font-medium text-slate-800">
                Trip fare {formatMoney(pending.fareEstimate.total)} ·{" "}
                {pending.fareEstimate.distanceKm.toFixed(1)} km total
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white"
                onClick={() =>
                  repo.rejectRideAsDriver({
                    rideId: pending.id,
                    driverId: session.driverId,
                  })
                }
              >
                Reject
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-brand py-3 font-bold text-white"
                onClick={async () => {
                  await repo.acceptRideAsDriver({
                    rideId: pending.id,
                    driverId: session.driverId,
                    vehicleId: session.vehicleId,
                  });
                  router.push(`/trip/${pending.id}`);
                }}
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <p className="rounded-xl bg-slate-900/90 px-4 py-3 text-center text-sm text-slate-400">
            Map active — waiting for passenger requests…
          </p>
        )}

        <div className="pointer-events-auto mt-3 flex gap-2 text-sm">
          <Link href="/incoming" className="flex-1 rounded-xl bg-slate-800 py-2 text-center text-white">
            Requests
          </Link>
          <Link href="/earnings" className="flex-1 rounded-xl bg-slate-800 py-2 text-center text-white">
            Earnings
          </Link>
          <Link href="/history" className="flex-1 rounded-xl bg-slate-800 py-2 text-center text-white">
            History
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="pointer-events-auto absolute left-3 bottom-2 z-50 text-xs text-red-400 underline"
      >
        Sign out
      </button>
    </div>
  );
}

export function DriverMapDashboard() {
  return (
    <MapProvider>
      <DashboardInner />
    </MapProvider>
  );
}
