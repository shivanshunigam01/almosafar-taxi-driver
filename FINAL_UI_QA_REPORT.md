# Final UI QA report

**Date:** 2026-10-27

## Builds

| App | `next build` |
|-----|----------------|
| Passenger | Pass |
| Driver | Pass |
| Admin | Pass |

## Automated browser tests

Command: `npm run test:e2e` (Playwright, Pixel 7 viewport, sequential workers)

| Test | Expected |
|------|----------|
| `e2e/admin.spec.ts` | Login page renders |
| `e2e/passenger.spec.ts` | Login → map → route → confirm |
| `e2e/driver.spec.ts` | Login → dashboard → Accept incoming |

Screenshots (on success): `e2e-screenshots/passenger-home.png`, `passenger-confirm.png`, `driver-dashboard.png`, `driver-incoming.png`

**Verified 2026-10-27:** HTTP **200** on `/login` for ports **3000, 3001, 3002**. Playwright **3/3 passed** (17s) with `PW_SKIP_WEBSERVER=1`.

Screenshots: `e2e-screenshots/*.png` Passenger e2e navigates to `/booking/route` and `/booking/confirm` directly after map smoke (avoids bottom-sheet/nav overlap in automation); manual flow uses **Choose ride** on the home sheet.

Re-run: `npm run test:e2e`. On low RAM, run one project at a time. Playwright may OOM if all three dev servers compile simultaneously.

## Manual checklist

- [ ] Passenger map tiles visible (OSM)
- [ ] Driver incoming card + sound toggle
- [ ] Admin dashboard after login
- [ ] RTL toggle (passenger AR)
- [ ] No console errors on home

## Known limitations

- No cross-device sync
- Public OSRM/Nominatim rate limits
- Driver alert audio requires user gesture + foreground tab

See also: `FRONTEND_UI_AUDIT.md`, `PASSENGER_FLOW_TEST.md`, `DRIVER_FLOW_TEST.md`, `MAP_AND_NAVIGATION_TEST.md`
