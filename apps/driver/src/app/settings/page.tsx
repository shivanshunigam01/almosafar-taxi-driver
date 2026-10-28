"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmAction, notifyUser } from "@almosafar/ui";
import { useRideRepo } from "@/context/RideRepoContext";
import { useAuth } from "@/context/AuthContext";
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  NotificationSoundPlayer,
} from "@/lib/notification-sound";

export default function DriverSettings() {
  const repo = useRideRepo();
  const { logout } = useAuth();
  const router = useRouter();
  const [prefs, setPrefs] = useState(() => loadNotificationPrefs());

  const update = (patch: Partial<typeof prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    saveNotificationPrefs(next);
  };

  return (
    <div className="space-y-4 py-4 pb-24">
      <Link href="/dashboard" className="text-sm text-amber-400">
        ← Back to map
      </Link>
      <h1 className="text-lg font-bold">Settings</h1>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
        <h2 className="font-semibold text-amber-400">Request alerts</h2>
        <button
          type="button"
          className="w-full rounded-xl bg-amber-500 py-2 font-semibold text-slate-950"
          onClick={() => {
            const player = new NotificationSoundPlayer();
            player.unlockFromUserGesture();
            update({ soundEnabled: true });
            player.startRepeatingAlert(prefs.volume, 900);
            notifyUser("Sound enabled for this browser session (demo).");
            setTimeout(() => player.dispose(), 2000);
          }}
        >
          Enable & test sound
        </button>
        <label className="flex items-center justify-between text-sm">
          <span>Mute alerts</span>
          <input
            type="checkbox"
            checked={prefs.muted}
            onChange={(e) => update({ muted: e.target.checked })}
          />
        </label>
        <label className="block text-sm">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={prefs.volume}
            className="mt-1 w-full"
            onChange={(e) => update({ volume: parseFloat(e.target.value) })}
          />
        </label>
      </section>

      <Link href="/vehicle" className="block rounded-xl bg-slate-800 p-4 text-center">
        Vehicle profile
      </Link>

      <button
        type="button"
        className="w-full rounded-xl border border-red-500 py-3 text-red-400"
        onClick={() => {
          if (!confirmAction("Reset driver demo data in this browser?")) return;
          repo.resetDemo();
          notifyUser("Demo reset. Reloading dashboard.");
          window.location.href = "/dashboard";
        }}
      >
        Reset local demo data
      </button>
      <button
        type="button"
        className="w-full rounded-xl border border-slate-600 py-3"
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
