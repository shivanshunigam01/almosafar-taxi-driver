"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { confirmAction, notifyUser } from "@almosafar/ui";
import { useLocale } from "@/context/LocaleContext";
import { useRideRepo } from "@/context/RideRepoContext";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { locale, setLocale } = useLocale();
  const repo = useRideRepo();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6">
      <Link href="/home/profile" className="text-sm text-brand">
        ← Profile
      </Link>
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      <label className="block text-sm font-medium text-slate-700">
        Language
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3"
          value={locale}
          onChange={(e) => {
            setLocale(e.target.value as "en" | "ar");
            notifyUser(locale === "en" ? "Language set to Arabic (RTL)." : "Language set to English.");
          }}
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </label>
      <Link
        href="/payments"
        className="block rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-800"
      >
        Payment methods (simulation)
      </Link>
      <button
        type="button"
        className="w-full rounded-xl border border-red-300 bg-white py-3 font-medium text-red-700"
        onClick={() => {
          if (!confirmAction("Reset all demo rides and data in this browser?")) return;
          repo.resetDemo();
          notifyUser("Demo data reset. The page will reload.");
          window.location.href = "/home";
        }}
      >
        Reset local demo data
      </button>
      <button
        type="button"
        className="w-full rounded-xl border border-slate-200 py-3 text-slate-700"
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
