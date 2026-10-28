"use client";

import Link from "next/link";
import { computeDriverEarnings, formatMoney, getDemoSeedBundle } from "@almosafar/shared";

export default function EarningsPage() {
  const seed = getDemoSeedBundle();
  const gross = seed.rides[0]?.fareEstimate?.total ?? {
    amountMinor: 1200000,
    currency: "IQD" as const,
  };
  const sample = computeDriverEarnings(gross);
  const monthGross = { ...gross, amountMinor: gross.amountMinor * 12 };
  const monthNet = computeDriverEarnings(monthGross);

  return (
    <div className="space-y-4 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-amber-400">
        ← Back to map
      </Link>
      <h1 className="text-lg font-bold">Earnings (demo)</h1>
      <div className="rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-slate-400">Today (sample from seed ride)</p>
        <p className="text-2xl font-bold text-amber-400">{formatMoney(sample.driverNet)}</p>
        <p className="mt-1 text-xs text-slate-500">
          Gross {formatMoney(sample.gross)} · Commission demo {Math.round(sample.commissionRate * 100)}%
        </p>
      </div>
      <div className="rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-slate-400">This month (simulated ×12)</p>
        <p className="text-xl font-bold">{formatMoney(monthNet.driverNet)}</p>
      </div>
      <Link
        href="/history"
        className="block rounded-xl bg-amber-500 py-3 text-center font-bold text-slate-950"
      >
        View trip history
      </Link>
    </div>
  );
}
