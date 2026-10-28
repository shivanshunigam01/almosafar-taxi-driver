"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { session, logout } = useAuth();
  const router = useRouter();
  return (
    <div className="space-y-4 bg-slate-50 px-4 py-6">
      <h1 className="text-xl font-bold text-slate-900">Profile</h1>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="font-semibold">{session?.name}</p>
        <p className="text-sm text-slate-500">{session?.email}</p>
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