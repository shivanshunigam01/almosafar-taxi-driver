# Almosafar Taxi — Driver (Expo)

Independent Expo dev-client app with Android package **`com.almosafar.taxi.driver`**. Uses `@almosafar/shared` for rides, fares, driver APIs, and Firestore/local demo backends.

## Run

From repository root after `npm install` and `npm run build:shared`:

```bash
npm run driver
```

Demo login: `demo.driver.khalid@example.com` (any password).

## Flows

- Demo login and profile (vehicle, settings, notifications)
- Home dashboard with **online/offline** toggle
- Incoming requests with **30s countdown**, accept/reject
- Trip: navigate to pickup → arrived → **demo PIN** → start trip → **simulated** map tracking → complete
- Receipt with **15% demo commission** and net earnings
- Ride history, daily/monthly earnings (IQD formatting, AR/EN + RTL)

**Local demo:** going online injects a deterministic Baghdad dispatch ride if none are open. **Firestore:** open `requested` rides via subscription; accept uses a **transaction** claim when configured.

## EAS APK

Configure `extra.eas.projectId` in `app.config.ts`, then:

```bash
cd apps/driver
eas build -p android --profile driver-apk
```
