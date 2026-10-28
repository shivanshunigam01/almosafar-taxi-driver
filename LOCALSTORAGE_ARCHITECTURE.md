# localStorage architecture

## Package: `@almosafar/demo-core`

### Keys (schema version 1)

| Scope | Key |
|-------|-----|
| Passenger site | `almosafar.demo.passenger.v1` |
| Driver site | `almosafar.demo.driver.v1` |
| Admin site | `almosafar.demo.admin.v1` |

### `LocalStorageRideRepository`

- Wraps `@almosafar/shared` `LocalDemoRideRepository`
- Persists `{ schemaVersion, rides[], driverOnline{}, updatedAt }` with Zod validation
- Implements shared `RideRepository` interface for future swap to HTTP/WebSocket backend
- **Same-origin sync:** `storage` event + `BroadcastChannel` (`almosafar.demo.sync`) between tabs on the **same** hostname/port only

### `LocalStorageConfigRepository`

- Admin demo preferences and JSON export/import envelopes
- Export explicitly documents that import applies to **admin origin only**

### Guards

- `isBrowser()` checks before touching `localStorage`
- React providers hydrate session/booking after mount to avoid SSR mismatch

## Replacement path

Implement `HttpRideRepository` (future) behind the same `RideRepository` interface; UI layers depend on context hooks, not storage directly.
