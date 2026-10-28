"use client";

import Link from "next/link";

export default function DriverWelcomePage() {
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col bg-slate-950 text-white">
      <div className="flex-1 px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">Driver app</p>
        <h1 className="mt-2 text-3xl font-bold">Go online and accept simulated trips</h1>
        <p className="mt-3 text-slate-400">
          Full-screen map, incoming request card, Google Maps navigation, and earnings — all on this
          browser (port 3002).
        </p>
      </div>
      <div className="space-y-3 border-t border-slate-800 px-6 py-6">
        <Link href="/register" className="block rounded-xl bg-amber-500 py-3.5 text-center font-bold text-slate-950">
          Register (demo)
        </Link>
        <Link
          href="/login"
          className="block rounded-xl border border-slate-600 py-3.5 text-center font-medium text-white"
        >
          Sign in
        </Link>
        <Link href="/onboarding" className="block text-center text-sm text-amber-400">
          How simulation works
        </Link>
      </div>
    </div>
  );
}
