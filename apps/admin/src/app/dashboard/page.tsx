"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatMoney,
  type CurrencyCode,
  getDemoSeedBundle,
  type Ride,
  type Driver,
} from "@almosafar/shared";
import { useAdminData } from "../../context/AdminDataContext";
import { useAdminLocale } from "../../context/AdminLocaleContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { AdminLiveMap } from "../../components/dashboard/AdminLiveMap";

export default function DashboardPage() {
  const { admin } = useAdminData();
  const { t, moneyLocale } = useAdminLocale();
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [passengerCount, setPassengerCount] = useState(0);
  const seed = getDemoSeedBundle();

  useEffect(() => {
    if (!admin) return;
    admin.listDrivers().then(setDrivers);
    admin.listPassengers().then((p) => setPassengerCount(p.length));
    return admin.subscribeRides(setRides);
  }, [admin, seed.passengers.length]);

  const kpis = useMemo(() => {
    const active = rides.filter((r) =>
      ["requested", "accepted", "driver_arriving", "in_progress"].includes(r.status)
    );
    const completed = rides.filter((r) => r.status === "completed");
    let grossMinor = 0;
    const currency: CurrencyCode = "IQD";
    for (const r of completed) {
      const g = r.fareFinal?.total ?? r.fareEstimate?.total;
      if (!g) continue;
      grossMinor += g.amountMinor;
    }
    const online = drivers.filter((d) => d.isOnline).length;
    return {
      totalRides: rides.length,
      activeDrivers: online,
      passengers: passengerCount || seed.passengers.length,
      revenueMinor: grossMinor,
      currency,
      active: active.length,
      completed: completed.length,
    };
  }, [rides, drivers, passengerCount, seed.passengers.length]);

  const trend = useMemo(() => {
    const days = [12, 18, 15, 22, 19, 28, 24];
    return days;
  }, []);

  const recent = useMemo(
    () =>
      [...rides]
        .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
        .slice(0, 8),
    [rides]
  );

  const passengerName = (id: string) =>
    seed.passengers.find((p) => p.id === id)?.displayName ?? id.slice(0, 8);
  const driverName = (id?: string) =>
    id ? seed.drivers.find((d) => d.id === id)?.displayName ?? "—" : "—";

  return (
    <>
      <PageHeader title={t("nav.dashboard")} lead={t("demoDisclaimer")}>
        <span className="live-pill">
          <span className="live-pill-dot" />
          {kpis.active} live
        </span>
      </PageHeader>

      <div className="kpi-grid kpi-grid--hero">
        <div className="kpi kpi--hero">
          <div className="kpi-label">Total rides</div>
          <div className="kpi-value">{kpis.totalRides || 124}</div>
        </div>
        <div className="kpi kpi--hero">
          <div className="kpi-label">Active drivers</div>
          <div className="kpi-value">{kpis.activeDrivers || 85}</div>
        </div>
        <div className="kpi kpi--hero">
          <div className="kpi-label">Passengers</div>
          <div className="kpi-value">{kpis.passengers}</div>
        </div>
        <div className="kpi kpi--hero">
          <div className="kpi-label">Total revenue</div>
          <div className="kpi-value kpi-value--money">
            {formatMoney(
              { currency: kpis.currency, amountMinor: kpis.revenueMinor || 1_245_000_00 },
              moneyLocale
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-split">
        <section className="card card--chart">
          <h2>Rides overview</h2>
          <p className="card-sub">Weekly trend (demo seed)</p>
          <div className="line-chart" aria-hidden>
            <svg viewBox="0 0 400 120" className="line-chart-svg">
              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinejoin="round"
                points={trend
                  .map((v, i) => `${(i / (trend.length - 1)) * 380 + 10},${110 - v * 3}`)
                  .join(" ")}
              />
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
              <polygon
                fill="url(#chartFill)"
                points={`10,110 ${trend
                  .map((v, i) => `${(i / (trend.length - 1)) * 380 + 10},${110 - v * 3}`)
                  .join(" ")} 390,110`}
              />
            </svg>
          </div>
        </section>
        <AdminLiveMap />
      </div>

      <section className="card">
        <div className="card-header-row">
          <h2>Recent rides</h2>
          <Link href="/rides" className="link-soft">
            View all
          </Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted-cell">
                    No rides in local admin store — seed data appears after demo activity.
                  </td>
                </tr>
              ) : (
                recent.map((r) => {
                  const fare = r.fareFinal?.total ?? r.fareEstimate?.total;
                  return (
                    <tr key={r.id}>
                      <td>{passengerName(r.passengerId)}</td>
                      <td>{driverName(r.driverId)}</td>
                      <td className="route-cell">
                        {r.pickup.label.split("—").pop()?.trim() ?? r.pickup.label} →{" "}
                        {r.dropoff.label.split("—").pop()?.trim() ?? r.dropoff.label}
                      </td>
                      <td>{fare ? formatMoney(fare, moneyLocale) : "—"}</td>
                      <td>
                        <span className={`status-pill status-pill--${r.status}`}>
                          {r.status.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
