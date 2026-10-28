# QA report — Almosafar Taxi (web + map premium)

**Date:** 2026-10-27 (updated after map-first pass)

## Automated

| Check | Result |
|-------|--------|
| `npm run build -w @almosafar/shared` | Pass |
| `npm run build -w @almosafar/maps` | Pass |
| `npm run build -w @almosafar/passenger` | Pass |
| `npm run build -w @almosafar/driver` | Pass |
| `npm run build -w @almosafar/admin` | Pass |
| `npm run typecheck` (all workspaces) | Pass |
| `@almosafar/shared` tests | 7/7 pass |
| `@almosafar/demo-core` tests | 1/1 pass |
| `@almosafar/maps` tests | 3/3 pass |

## Map / integration tests (automated)

| Area | Coverage |
|------|----------|
| Google Maps URL builder | `navigation-link.test.ts` |
| Routing fallback when OSRM unreachable | `routing-fallback.test.ts` |
| localStorage ride repo | `demo-core` test |

## Manual smoke (recommended)

| App | URL | Command |
|-----|-----|---------|
| Admin | http://localhost:3000 | `npm run dev:admin` |
| Passenger | http://localhost:3001 | `npm run dev:passenger` |
| Driver | http://localhost:3002 | `npm run dev:driver` |
| All | — | `npm run dev:all` |

**Passenger:** `/home` map, search destination, `/booking/route` fare, confirm ride, watch active map.

**Driver:** Enable sound in settings, go online, accept simulated request, Navigate, complete trip.

## Known limitations

- No cross-origin / cross-device ride sync.
- Public OSRM/Nominatim rate limits in production.
- Driver alert audio requires foreground tab + user gesture.
- Marker clustering not enabled (low marker count in demo).

## Legacy

Expo apps archived under `apps/_legacy/`.
