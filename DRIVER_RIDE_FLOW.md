# Driver ride flow

## Map-first dashboard (`/dashboard`)

- Full-screen map, GPS dot, online/offline toggle.
- **Simulated** incoming request card when online (`ensureLocalDemoDispatchScenario`).
- Accept / reject require explicit tap (no auto-accept).
- 30s demo countdown → auto-reject on timeout.
- Earnings snippet, links to history / settings.

## Lifecycle (shared validation)

`requested` → `accepted` → `driver_arriving` → `in_progress` → `completed`

Also: `rejected`, `cancelled`.

## Trip screen (`/trip/[id]`)

- Route map + simulated driver movement during `in_progress`.
- **Navigate** opens Google Maps driving URL (no API key).
- Copy coordinates + browser fallback link.
- Demo passenger PIN before starting trip when `demoPassengerPin` is set.
- Manual advance buttons call `transitionRideAsDriver`.

## Incoming list (`/incoming`)

Legacy list view; dashboard card is primary UX.

## Earnings / history / vehicle / settings

- Earnings: shared `computeDriverEarnings` on completed ride totals.
- Settings: notification sound prefs, reset demo.

## Limitations

Incoming requests are **generated locally** when the driver goes online—not from another device’s passenger app.
