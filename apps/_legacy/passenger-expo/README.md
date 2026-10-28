# Almosafar Taxi — Passenger (Expo)

Standalone Expo app (`com.almosafar.taxi.passenger`) for the full demo passenger journey.

## Flows

Splash → onboarding → demo login/register → home (pickup/destination) → route preview & fare estimate → category → confirm → search driver → active trip (simulated driver in local mode) → completion → rating → history & profile.

## Data sync

- **Local (default):** `@almosafar/shared` `LocalDemoDataService` — rides stay on this device; UI shows an explicit local-demo notice. Driver simulation runs on-device for end-to-end demo.
- **Cloud:** Set `EXPO_PUBLIC_FIREBASE_PROJECT_ID` and `EXPO_PUBLIC_FIREBASE_API_KEY` — rides are written to Firestore `rides` collection for driver/admin when those apps use the same project.

## Run

From monorepo root:

```bash
npm install
npm run build:shared
npm run passenger
```

## Typecheck

```bash
npm run typecheck -w @almosafar/passenger
```
