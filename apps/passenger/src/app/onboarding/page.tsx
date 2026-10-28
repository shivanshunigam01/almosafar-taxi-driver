"use client";

import Link from "next/link";
import { MapPin, Shield, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingPage() {
  const { completeOnboarding } = useAuth();
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col bg-white">
      <div className="relative h-56 bg-[#0c1222]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#2563eb55,transparent_60%)]" />
        <svg className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 translate-y-4" viewBox="0 0 320 100" aria-hidden>
          <path fill="#fff" d="M30 70h260l-24-44H54L30 70z" opacity="0.9" />
          <circle cx="90" cy="72" r="10" fill="#2563eb" />
          <circle cx="230" cy="72" r="10" fill="#2563eb" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
        <h1 className="text-3xl font-bold leading-tight text-slate-900">
          Move around Baghdad easily
        </h1>
        <p className="mt-3 text-slate-600">
          Book a ride in seconds. Transparent fares in IQD. This build runs entirely in your browser
          — no cross-device sync.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            { icon: MapPin, title: "Map-first pickup", text: "Search or pin locations on OpenStreetMap." },
            { icon: Wallet, title: "Cash & demo wallet", text: "Simulated payments — no real charges." },
            { icon: Shield, title: "Safe demo data", text: "Rides stay on this site until you reset." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-3 pt-8">
          <Link
            href="/welcome"
            onClick={() => completeOnboarding()}
            className="btn-brand block"
          >
            Get started
          </Link>
          <Link href="/login" className="block text-center text-sm font-medium text-brand">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
