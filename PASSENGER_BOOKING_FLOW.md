# Passenger booking flow

## Map-first home (`/home`)

1. App loads map (Baghdad default if GPS denied).
2. Browser may prompt for geolocation; blue dot = current position.
3. Bottom sheet: **Where to?**, pickup field, saved Home/Work, recent destinations.
4. Search uses presets + throttled Nominatim; map markers draggable.
5. Route loads via `@almosafar/maps` → stored in `BookingContext.route` (localStorage).

## Steps

| Step | Route | Action |
|------|-------|--------|
| Splash / onboarding / auth | `/`, `/onboarding`, `/login`, `/register` | Demo session in localStorage |
| Map home | `/home` | Pick pickup & destination |
| Vehicle & fare | `/booking/route` | Categories: economy, comfort, xl, premium; fare via `estimateTripFare` + route metrics |
| Confirm | `/booking/confirm` | `buildRideRequest` → `createRideRequest`; **local** driver simulation on same origin |
| Searching | `/ride/searching/[id]` | Animated spinner; redirects when status advances |
| Active trip | `/ride/active/[id]` | Map, driver card, call/message demo, cancel |
| Receipt / rating | `/ride/completed/[id]`, `/ride/rating/[id]` | Existing flows |
| History / profile / settings / payments | `/home/history`, etc. | localStorage + shared models |

## Fare engine

Always use `@almosafar/shared`:

- `findFareConfiguration`
- `estimateTripFare({ pickup, dropoff, fareConfig, distanceKm?, durationMinutes? })`

Route distance/duration from OSRM or fallback is passed when available.

## Limitations

- Passenger on **:3001** does **not** send live requests to driver on **:3002** or another phone.
- `startLocalDriverSimulation` advances ride state **in the passenger browser store only**.
