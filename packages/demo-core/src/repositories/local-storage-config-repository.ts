import { LocalAdminDataService } from "@almosafar/shared";
import { getDemoSeedBundle } from "@almosafar/shared";
import { readStorage, writeStorage, removeStorage } from "../storage/browser";
import { storageKey } from "../storage/keys";
import { z } from "zod";

const configEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  label: z.string(),
  payload: z.record(z.unknown()),
});

/**
 * Admin demo configuration persisted in localStorage on the admin origin only.
 */
export class LocalStorageConfigRepository {
  readonly key = storageKey("admin");

  createAdminService(): LocalAdminDataService {
    return new LocalAdminDataService();
  }

  exportDemoJson(label = "almosafar-admin-demo"): string {
    const seed = getDemoSeedBundle();
    return JSON.stringify(
      configEnvelopeSchema.parse({
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        label,
        payload: {
          note: "Import on the same admin origin only. Does not sync passenger/driver sites.",
          fares: seed.fareConfigurations,
          zone: seed.zone,
          operationalSettings: seed.operationalSettings,
        },
      }),
      null,
      2
    );
  }

  importDemoJson(json: string): void {
    const env = configEnvelopeSchema.parse(JSON.parse(json));
    writeStorage(this.key, env);
  }

  savePreferences(prefs: Record<string, unknown>): void {
    writeStorage(this.key, {
      schemaVersion: 1,
      preferences: prefs,
      updatedAt: new Date().toISOString(),
    });
  }

  readPreferences(): Record<string, unknown> | null {
    const raw = readStorage<{ preferences?: Record<string, unknown> }>(this.key);
    return raw?.preferences ?? null;
  }

  reset(): void {
    removeStorage(this.key);
  }
}
