# Deployment guide (Vercel or compatible)

## Build commands

```powershell
cd "c:\Users\Admin\Desktop\uber clone"
npm ci
npm run build -w @almosafar/admin
npm run build -w @almosafar/passenger
npm run build -w @almosafar/driver
```

## Three projects (recommended)

Create **three** Vercel projects (or three static hosts) from the monorepo:

| Project | Root directory | Build command | Output |
|---------|----------------|---------------|--------|
| Admin | `apps/admin` | `npm run build` | Next.js default |
| Passenger | `apps/passenger` | `npm run build` | Next.js default |
| Driver | `apps/driver` | `npm run build` | Next.js default |

Install command at repo root: `npm ci` (include workspaces).

Set Node **20+**.

## Environment variables

No Firebase variables required for this phase. Optional:

- `NEXT_PUBLIC_ALMOSAFAR_DEMO_MODE=true` (admin banner)

## Post-deploy

- Passenger URL → Median passenger APK
- Driver URL → Median driver APK
- Admin URL → browser-only operations dashboard

## Local production smoke

```powershell
npm run start -w @almosafar/admin
npm run start -w @almosafar/passenger
npm run start -w @almosafar/driver
```

Ports: 3000 / 3001 / 3002 respectively.
