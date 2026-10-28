# Median.co — three GitHub repos (Passenger, Driver, Admin)

Each repo contains the **full monorepo** so shared packages (`packages/shared`, `maps`, `ui`, `demo-core`) build correctly. Point your host at one app folder per repo.

## Repos (GitHub: `shivanshunigam01`)

| Role | Repository | App folder | Local port |
|------|------------|------------|------------|
| Passenger | `almosafar-taxi-passenger` | `apps/passenger` | 3001 |
| Driver | `almosafar-taxi-driver` | `apps/driver` | 3002 |
| Admin | `almosafar-taxi-admin` | `apps/admin` | 3000 |

## Deploy (example: Vercel)

Create **three Vercel projects**, each linked to its repo (same code layout in each):

1. **Root Directory:** `apps/passenger` (or `apps/driver` / `apps/admin`)
2. **Install:** `npm install` from repository root (enable monorepo / include root `package.json`)
3. **Build:** `npm run build -w @almosafar/passenger` (swap workspace name per app)
4. **Output:** Next.js default

After deploy you get three HTTPS URLs — use those in **Median Buddy** as Start URLs (two mobile apps: passenger + driver; admin is optional desktop/tablet).

## Median Buddy

| Median app | Start URL |
|------------|-----------|
| Almosafar Passenger | `https://<your-passenger-host>/` |
| Almosafar Driver | `https://<your-driver-host>/` |

Admin is usually **not** wrapped in Median; use the admin URL in a browser.

## Local demo limits

Each origin has its own `localStorage`. Passenger and driver **do not sync** across APKs without a real backend.
