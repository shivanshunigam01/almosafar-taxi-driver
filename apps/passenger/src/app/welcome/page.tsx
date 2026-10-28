"use client";

import Link from "next/link";
import { Car, MapPin, Shield } from "lucide-react";
import { AlmosafarLogo } from "@almosafar/ui";
import { useAuth } from "@/context/AuthContext";

export default function WelcomePage() {
  const { session } = useAuth();

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col bg-white">
      <div className="px-6 pt-10">
        <AlmosafarLogo size="md" variant="light" />
      </div>
      <div className="flex-1 px-6 pb-8 pt-6">
        <h1 className="text-3xl font-bold leading-tight text-slate-900">
          Ride across Baghdad with confidence
        </h1>
        <p className="mt-3 text-slate-600">
          Map-first booking, transparent IQD fares, and a complete demo journey on this device.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            { icon: MapPin, text: "Pick pickup and destination on the map" },
            { icon: Car, text: "Economy, Comfort, XL and Premium" },
            { icon: Shield, text: "Simulated payments — no real charges" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <Icon className="mt-0.5 h-5 w-5 text-brand" />
              <span className="text-sm text-slate-700">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 border-t border-slate-200 bg-white px-6 py-6">
        {session ? (
          <Link href="/home" className="btn-brand block">
            Continue to map
          </Link>
        ) : (
          <>
            <Link href="/register" className="btn-brand block">
              Create demo account
            </Link>
            <Link
              href="/login"
              className="block rounded-2xl border border-slate-200 py-3.5 text-center font-medium text-slate-800"
            >
              Sign in
            </Link>
          </>
        )}
        <Link href="/onboarding" className="block text-center text-sm text-brand underline">
          How the demo works
        </Link>
      </div>
    </div>
  );
}
