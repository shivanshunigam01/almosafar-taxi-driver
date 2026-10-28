# Web migration report — Almosafar Taxi

**Date:** 2026-10-27  
**Branch:** `feature/nextjs-web-migration` (checkpoint: `backup/pre-nextjs-migration`)

## Summary

Passenger and driver were migrated from **Expo / React Native** to **Next.js 15 + React 19 + TypeScript + Tailwind CSS v4**. Admin remains Next.js and now uses **in-memory local admin only** (no Firebase runtime). Shared business logic (`@almosafar/shared`) is unchanged in purpose; new **`@almosafar/demo-core`** adds browser `localStorage` persistence.

## Legacy preservation

| Path | Contents |
|------|----------|
| `apps/_legacy/passenger-expo/` | Full former passenger RN app (EAS, Metro, etc.) |
| `apps/_legacy/driver-expo/` | Full former driver RN app |
| Git | `backup/pre-nextjs-migration` branch |

## Created

- `packages/demo-core/` — `LocalStorageRideRepository`, `LocalStorageConfigRepository`, Zod envelopes, tests
- `apps/passenger/` — new Next.js passenger site (replaced RN app path)
- `apps/driver/` — new Next.js driver site
- `apps/passenger/.easignore` removed from active tree (legacy only)
- Docs: `WEB_MIGRATION_REPORT.md`, `LOCAL_DEMO_GUIDE.md`, `LOCALSTORAGE_ARCHITECTURE.md`, `MEDIAN_APK_PACKAGING_GUIDE.md`, `DEPLOYMENT_GUIDE.md`

## Modified

- Root `package.json` — workspaces limited to admin/passenger/driver/packages; scripts `dev:admin|passenger|driver|all`; removed RN override; postinstall builds shared/ui/demo-core
- `packages/shared` — `exportSnapshot`/`restoreSnapshot` on `LocalDemoRideRepository`; demo exports on main index; `LocalAdminDataService` export
- `apps/admin` — `AdminDataContext` uses `LocalAdminDataService` only (no Firebase env)

## Removed from active apps (not from git legacy)

- Expo, EAS, Metro, React Navigation from **active** `apps/passenger` and `apps/driver`
- Firebase client usage from **admin** runtime provider

`firebase/` folder remains in repo for reference but is **not** used by the three web apps in this phase.

## Test results (actual)

| Command | Result |
|---------|--------|
| `npm run build -w @almosafar/passenger` | **Pass** |
| `npm run build -w @almosafar/driver` | **Pass** |
| `npm run build -w @almosafar/admin` | **Pass** |
| `npm run test` (shared + demo-core) | **8/8 pass** (7 shared + 1 demo-core) |
| `npm run typecheck` | **Pass** (all workspaces) |

## Simulated vs real

| Feature | Status |
|---------|--------|
| Fare calculation | Real shared formulas (IQD) |
| Ride lifecycle | Real shared transitions (per-origin storage) |
| Cross-device / cross-app sync | **Not implemented** — separate origins & localStorage |
| Payments | UI simulation only |
| Driver incoming (passenger phone) | **Simulated** on driver site only |
| GPS / maps | Leaflet + OSM tiles; preset Baghdad locations |
| Push / background location | **Not implemented** |

## Known limitations

- Passenger `:3001` and driver `:3002` do **not** share ride state.
- Admin localStorage export does not push to passenger/driver domains.
- Firebase Cloud Functions and Firestore are inactive in this phase.
