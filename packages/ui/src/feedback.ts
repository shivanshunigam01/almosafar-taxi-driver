/** Lightweight user feedback for demo apps (no toast library required). */
export function confirmAction(message: string): boolean {
  if (typeof window === "undefined") return false;
  return window.confirm(message);
}

export function notifyUser(message: string): void {
  if (typeof window === "undefined") return;
  window.alert(message);
}
