export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  return safeParseJson<T>(localStorage.getItem(key));
}

export function writeStorage(key: string, value: unknown): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}
