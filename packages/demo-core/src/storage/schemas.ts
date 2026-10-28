import { z } from "zod";
import { rideSchema } from "@almosafar/shared";

export const rideSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  rides: z.array(rideSchema),
  driverOnline: z.record(z.string(), z.boolean()),
  updatedAt: z.string(),
});

export type RideSnapshot = z.infer<typeof rideSnapshotSchema>;

export const adminSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  rides: z.array(rideSchema),
  fares: z.array(z.record(z.unknown())),
  ops: z.record(z.unknown()),
  updatedAt: z.string(),
});

export type AdminSnapshot = z.infer<typeof adminSnapshotSchema>;
