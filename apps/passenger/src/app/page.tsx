"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlmosafarLogo } from "@almosafar/ui";
import { useAuth } from "@/context/AuthContext";

export default function SplashPage() {
  const router = useRouter();
  const { session, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const onboardingDone =
        session?.onboardingDone ||
        localStorage.getItem("almosafar.passenger.onboardingDone") === "1";
      if (session && onboardingDone) router.replace("/home");
      else if (session) router.replace("/home");
      else router.replace("/onboarding");
    }, 1400);
    return () => clearTimeout(t);
  }, [hydrated, session, router]);

  return (
    <div className="relative flex min-h-[calc(100dvh-2.5rem)] flex-col items-center justify-end overflow-hidden bg-[#0c1222] pb-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#2563eb33,transparent)]" />
      <div className="relative mb-auto mt-20 flex flex-col items-center px-6">
        <AlmosafarLogo size="lg" variant="dark" />
      </div>
      <div className="relative w-full max-w-sm px-8">
        <svg viewBox="0 0 320 120" className="w-full text-blue-500/90" aria-hidden>
          <path
            fill="currentColor"
            d="M20 85h280l-28-52H48L20 85zm32-58h216l20 38H52L52 27z"
            opacity="0.35"
          />
          <path
            fill="#fff"
            d="M40 78h240l-22-42H62L40 78zm36-36h168l14 28H76L76 42z"
          />
          <circle cx="88" cy="82" r="14" fill="#1e293b" stroke="#2563eb" strokeWidth="3" />
          <circle cx="232" cy="82" r="14" fill="#1e293b" stroke="#2563eb" strokeWidth="3" />
        </svg>
      </div>
      <p className="relative mt-6 text-sm text-slate-400">Baghdad · IQD · Local demo</p>
      <div className="relative mt-8 h-1 w-28 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
      </div>
    </div>
  );
}
