"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session) router.replace("/login");
  }, [hydrated, session, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
        <p className="text-sm text-slate-600">Loading your session…</p>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
