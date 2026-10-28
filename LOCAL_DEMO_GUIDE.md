# Local demo guide (Next.js web apps)

## URLs (development)

| App | URL |
|-----|-----|
| Admin | http://localhost:3000 |
| Passenger | http://localhost:3001 |
| Driver | http://localhost:3002 |

```powershell
cd "c:\Users\Admin\Desktop\uber clone"
npm run dev:all
```

## Important

Each app uses **its own origin** and **its own `localStorage`**. A ride booked on the passenger site **does not** appear on the driver site or on another phone unless you manually export/import JSON on the **same** origin (admin export is for admin configuration only).

## Passenger demo (localhost:3001)

1. Open `/login` — use `demo.passenger.sara@example.com` (any password).
2. Home → set pickup/destination (Baghdad presets).
3. Preview route & fare → confirm → searching → active ride (simulated driver progression on **this browser**).
4. History, profile, payments, settings (EN/AR), reset demo.

## Driver demo (localhost:3002)

1. Login — `demo.driver.khalid@example.com`.
2. Dashboard → **Go online** → triggers **simulated** incoming request in **this browser’s** storage.
3. Incoming → accept/reject → trip phases → complete.
4. Earnings/history/vehicle are demo data.

## Admin (localhost:3000)

1. Login with any email containing `admin`.
2. Manage fares, zones, rides (in-memory demo service on admin origin).
3. Settings — local demo mode only; use export/import for configuration JSON (does not sync other apps).
