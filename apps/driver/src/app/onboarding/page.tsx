"use client";

import Link from "next/link";

export default function DriverOnboardingPage() {
  return (
    <div className="space-y-6 px-6 py-10 text-slate-200">
      <h1 className="text-2xl font-bold text-white">Driver demo simulation</h1>
      <ul className="list-disc space-y-2 ps-5 text-sm text-slate-400">
        <li>Tap Go online to spawn a simulated incoming request in this browser.</li>
        <li>Accept or reject — sound alerts available in Settings.</li>
        <li>Navigate opens Google Maps externally.</li>
        <li>Not connected to passenger port 3001.</li>
      </ul>
      <Link href="/dashboard" className="block rounded-xl bg-amber-500 py-3.5 text-center font-bold text-slate-950">
        Open map dashboard
      </Link>
    </div>
  );
}
