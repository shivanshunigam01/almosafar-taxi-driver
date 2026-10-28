"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

function DashboardInner() {
  const { session, logout } = useAuth();
  const repo = useRideRepo();
  const router = useRouter();
  const { geolocation, routing } = useMapServices();
  const [online, setOnline] = useState(false);
  const [open, setOpen] = useState<Ride[]>([]);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [countdown, setCountdown] = useState(30);
  const seed = getDemoSeedBundle();

  const pending = open[0] ?? null;
  const { unlockSound } = useIncomingRideAlert(pending, online);

  useEffect(() => {
    if (!session) return;
    repo.isDriverOnline(session.driverId).then(setOnline);
  }, [session, repo]);

  const [secondsUntilDemo, setSecondsUntilDemo] = useState(20);

  useEffect(() => {
    if (!session || !online) return;
    void repo.ensureLocalDemoDispatchScenario?.(session.driverId);
  }, [session, online, repo]);

  useEffect(() => {
    if (!session) return;
    const end = Date.now() + 20_000;
    const tick = () => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSecondsUntilDemo(left);
      if (left === 0) {
        unlockSound();
        void repo.setDriverOnline(session.driverId, true).then(() => setOnline(true));
      }
    };
    tick();
    const t = setInterval(tick, 400);
    return () => clearInterval(t);
  }, [session, repo, unlockSound]);

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
    if (!pending || !online) return;
    setCountdown(30);
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [pending?.id, online, pending]);

  useEffect(() => {
    if (countdown === 0 && pending) {
      void repo.rejectRideAsDriver({
        rideId: pending.id,
        driverId: session!.driverId,
        note: "Timed out (demo)",
      });
    }
  }, [countdown, pending, repo, session]);

  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!pending) return;
    void routing
      .route(pending.pickup.geo, pending.dropoff.geo)
      .then((r) => setRoutePolyline(r.polyline));
  }, [pending, routing]);

  const todayEarnings = useMemo(() => {
    if (!session) return null;
    const gross = pending?.fareEstimate?.total;
    return gross ? computeDriverEarnings(gross) : null;
  }, [pending, session]);

  const center = gps ?? { lat: 33.3152, lng: 44.3661 };

  if (!session) return null;

  const driver = seed.drivers.find((d) => d.id === session.driverId);

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
                  routePolyline.length
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
          <p className="text-xs text-blue-400/90">Almosafar Driver</p>
          <p className="font-semibold">{session.name}</p>
        </div>
        <button
          type="button"
          className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-bold shadow-lg ${
            online ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-white"
          }`}
          onClick={async () => {
            unlockSound();
            const next = !online;
            try {
              await repo.setDriverOnline(session.driverId, next);
              if (next) await repo.ensureLocalDemoDispatchScenario?.(session.driverId);
            } catch {
              /* persist edge case — still flip UI for demo */
            }
            setOnline(next);
          }}
        >
          {online ? "Online" : "Go online"}
        </button>
      </div>

      {!online && (
        <div className="absolute inset-x-4 bottom-24 z-20 rounded-2xl border border-slate-700 bg-slate-900/95 p-6 text-center shadow-xl">
          <p className="text-lg font-semibold text-white">Demo dispatch warming up</p>
          <p className="mt-1 text-sm text-slate-400">
            {secondsUntilDemo > 0
              ? `Simulated pickup request in ${secondsUntilDemo}s — stay on this screen.`
              : "Going online…"}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Or tap Go online anytime. Local demo only (this browser · driver site).
          </p>
        </div>
      )}

      {online && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-3 pb-4">
          <div className="mb-3 grid grid-cols-3 gap-2 rounded-2xl bg-slate-900/95 p-3 text-center text-xs shadow-lg backdrop-blur">
            <div>
              <p className="text-slate-400">Today</p>
              <p className="font-bold text-blue-400">
                {todayEarnings ? formatMoney(todayEarnings.driverNet) : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Rating</p>
              <p className="font-bold">{(driver?.ratingAverage ?? 4.9).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-slate-400">Trips</p>
              <p className="font-bold">—</p>
            </div>
          </div>

          {pending ? (
            <div className="pointer-events-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">
                New ride request · {countdown}s
              </p>
              <p className="mt-2 font-semibold text-slate-900">{pending.pickup.label}</p>
              <p className="text-sm text-slate-600">→ {pending.dropoff.label}</p>
              {pending.fareEstimate && (
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {formatMoney(pending.fareEstimate.total)} ·{" "}
                  {pending.fareEstimate.distanceKm.toFixed(1)} km to pickup (demo)
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
              Waiting for simulated requests…
            </p>
          )}

          <div className="pointer-events-auto mt-3 flex gap-2 text-sm">
            <Link href="/incoming" className="flex-1 rounded-xl bg-slate-800 py-2 text-center">
              Requests
            </Link>
            <Link href="/earnings" className="flex-1 rounded-xl bg-slate-800 py-2 text-center">
              Earnings
            </Link>
            <Link href="/history" className="flex-1 rounded-xl bg-slate-800 py-2 text-center">
              History
            </Link>
            <Link href="/settings" className="flex-1 rounded-xl bg-slate-800 py-2 text-center">
              Settings
            </Link>
          </div>
        </div>
      )}

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
