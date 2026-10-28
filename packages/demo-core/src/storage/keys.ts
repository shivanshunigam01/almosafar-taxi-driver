export const DEMO_SCHEMA_VERSION = 1;

export type DemoAppScope = "passenger" | "driver" | "admin";

export function storageKey(scope: DemoAppScope): string {
  return `almosafar.demo.${scope}.v${DEMO_SCHEMA_VERSION}`;
}

export const SYNC_CHANNEL = "almosafar.demo.sync";
