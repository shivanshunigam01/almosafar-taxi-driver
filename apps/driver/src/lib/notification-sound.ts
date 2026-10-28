export type NotificationPrefs = {
  muted: boolean;
  volume: number;
  soundEnabled: boolean;
};

const PREFS_KEY = "almosafar.driver.notificationPrefs";

export function loadNotificationPrefs(): NotificationPrefs {
  if (typeof localStorage === "undefined") {
    return { muted: false, volume: 0.6, soundEnabled: false };
  }
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as NotificationPrefs;
  } catch {
    /* ignore */
  }
  return { muted: false, volume: 0.6, soundEnabled: false };
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/** Short Web Audio tone — no external asset required. */
export class NotificationSoundPlayer {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private unlocked = false;

  unlockFromUserGesture(): void {
    this.unlocked = true;
    if (typeof window === "undefined") return;
    try {
      this.ctx = this.ctx ?? new AudioContext();
      void this.ctx.resume();
    } catch {
      /* ignore */
    }
  }

  private beep(volume: number): void {
    if (!this.ctx || !this.unlocked) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = Math.max(0, Math.min(1, volume)) * 0.15;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  startRepeatingAlert(volume: number, intervalMs = 2800): void {
    this.stopAlert();
    this.beep(volume);
    this.intervalId = setInterval(() => this.beep(volume), intervalMs);
  }

  stopAlert(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  dispose(): void {
    this.stopAlert();
    void this.ctx?.close();
    this.ctx = null;
  }
}
