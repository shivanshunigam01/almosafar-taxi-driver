"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Star, User } from "lucide-react";
import { getDemoSeedBundle } from "@almosafar/shared";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const seed = getDemoSeedBundle();
  const passenger = seed.passengers.find((p) => p.id === session?.passengerId);

  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-slate-900">Profile</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white">
            {session?.name?.charAt(0) ?? "P"}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{session?.name}</p>
            <p className="flex items-center gap-1 text-sm text-slate-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {(passenger?.ratingAverage ?? 4.9).toFixed(1)} · Demo passenger
            </p>
          </div>
        </div>
        <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <li className="flex items-center gap-3 text-slate-700">
            <Phone className="h-4 w-4 shrink-0 text-brand" />
            <span>{session?.phone ?? "—"}</span>
          </li>
          <li className="flex items-center gap-3 text-slate-700">
            <Mail className="h-4 w-4 shrink-0 text-brand" />
            <span>{session?.email}</span>
          </li>
          <li className="flex items-center gap-3 text-slate-700">
            <User className="h-4 w-4 shrink-0 text-brand" />
            <span className="truncate text-xs text-slate-500">{session?.passengerId}</span>
          </li>
        </ul>
      </div>
      <Link href="/payments" className="block rounded-xl border border-slate-200 bg-white p-4 font-medium">
        Payment methods (simulated)
      </Link>
      <Link href="/settings" className="block rounded-xl border border-slate-200 bg-white p-4 font-medium">
        Settings
      </Link>
      <button
        type="button"
        className="w-full rounded-xl border border-red-200 py-3 text-red-600"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Sign out
      </button>
    </div>
  );
}
