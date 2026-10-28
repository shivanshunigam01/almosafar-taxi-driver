# Almosafar UI reference verification

Design source: `e2e-screenshots/almosafar-ui-reference.jpg` (collage mockup).

## Brand

- Royal blue primary (`#2563eb`), dark ink, white cards, map-first layouts.
- Original **Almosafar Taxi** identity — no third-party ride-hail logos.

## Screen map

### Passenger (17)

| # | Route / state | Capture file |
|---|----------------|--------------|
| 1 | `/` splash | `e2e-screenshots/reference-capture/p01-splash.png` |
| 2 | `/onboarding` | `p02-onboarding.png` |
| 3 | `/login` | `p03-login.png` |
| 4 | `/home` map + sheet | `p04-home-map.png` |
| 5 | Home sheet search | `p05-location-search.png` |
| 6 | `/booking/route` vehicles | `p06-vehicles.png` |
| 7 | `/booking/confirm` | `p07-confirm.png` |
| 8 | `/ride/searching/[id]` | `p08-searching-layout.png` |
| 9–10 | `/ride/active/[id]` | (after booking — live trip) |
| 11–13 | completed / rating | `/ride/completed`, `/ride/rating` |
| 14–17 | history, profile, payments, settings | `p14`–`p17` |

### Driver (9)

| # | Route | Capture file |
|---|--------|--------------|
| 1 | `/login` | `d01-login.png` |
| 2 | `/dashboard` | `d02-dashboard.png` |
| 3 | Incoming card | `d03-incoming.png` |
| 4–7 | `/trip/[id]` phases | trip flow (OTP, payment, complete) |
| 8 | `/earnings` | `d08-earnings.png` |
| 9 | `/settings` + vehicle | `d09-profile-settings.png` |

### Admin

| Route | Capture |
|-------|---------|
| `/dashboard` (1280×900) | `a01-dashboard.png` |

## Run capture tests

```powershell
npm run build
npm run start -w @almosafar/admin   # :3000
npm run start -w @almosafar/passenger # :3001
npm run start -w @almosafar/driver    # :3002
$env:PW_SKIP_WEBSERVER="1"; npx playwright test ui-reference-tour.spec.ts
```

Compare captures side-by-side with the reference collage. Layout parity is expected; pixel-perfect match is not required for OSM tiles and dynamic data.

## Demo honesty

localStorage is **per origin** (3000 / 3001 / 3002). No cross-device sync is implied.
