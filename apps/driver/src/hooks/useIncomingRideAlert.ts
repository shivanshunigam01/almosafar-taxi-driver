"use client";

import { useEffect, useRef } from "react";
import type { Ride } from "@almosafar/shared";
import {
  loadNotificationPrefs,
  NotificationSoundPlayer,
} from "@/lib/notification-sound";

export function useIncomingRideAlert(
  pending: Ride | null,
  online: boolean
): { unlockSound: () => void } {
  const playerRef = useRef<NotificationSoundPlayer | null>(null);
  useEffect(() => {
    playerRef.current = new NotificationSoundPlayer();
    return () => playerRef.current?.dispose();
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const prefs = loadNotificationPrefs();

    if (!online || !pending || pending.status !== "requested") {
      player.stopAlert();
      return;
    }

    if (!prefs.muted && prefs.soundEnabled) {
      player.startRepeatingAlert(prefs.volume);
    } else {
      player.stopAlert();
    }
  }, [pending, online]);

  return {
    unlockSound: () => playerRef.current?.unlockFromUserGesture(),
  };
}
