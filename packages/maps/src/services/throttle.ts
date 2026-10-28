export function createRateLimiter(minIntervalMs: number) {
  let lastAt = 0;
  return {
    async run<T>(fn: () => Promise<T>): Promise<T | null> {
      const now = Date.now();
      if (now - lastAt < minIntervalMs) return null;
      lastAt = now;
      return fn();
    },
  };
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
