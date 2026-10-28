"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Splash() {
  const { session, hydrated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      router.replace(session ? "/dashboard" : "/welcome");
    }, 1000);
    return () => clearTimeout(t);
  }, [hydrated, session, router]);
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-center bg-gradient-to-b from-amber-600 to-slate-950 px-6 text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-black/20 text-3xl font-bold">AT</div>
      <h1 className="text-3xl font-bold">Almosafar Driver</h1>
      <p className="mt-2 text-amber-100">Earn · Navigate · Demo dispatch</p>
    </div>
  );
}
