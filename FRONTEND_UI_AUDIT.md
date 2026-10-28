# Frontend UI audit

## Root causes of “black / text-only” experience

1. **`globals.css` forced OS dark mode** — `body { background: var(--background) }` with `@media (prefers-color-scheme: dark)` set `#0a0a0a`, overriding Tailwind `bg-slate-50` on many systems. **Fixed:** removed variable override; forced light theme (passenger) and explicit slate palette (driver).

2. **Driver app intentionally dark** — `bg-slate-950` read as “empty black” when map failed to load or sheet was empty. **Fixed:** branded splash/welcome, full map dashboard, amber accents, collapsible demo banner.

3. **Bottom nav covered booking CTA** — `BottomNav` (`z-40`) sat above the home sheet (`z-30`), blocking “Choose ride”. **Fixed:** sheet `z-50` + bottom padding above nav.

4. **Admin login crash** — `useToast()` without `ToastProvider`. **Fixed:** wrap admin `ClientProviders` with `ToastProvider`.

5. **Weak auth entry** — splash redirected quickly with minimal UI; no welcome/register/OTP path. **Fixed:** `/welcome`, polished login/register, `/verify-otp`, `/forgot-password`.

6. **Missing route guards** — `/home` reachable without session in some cases. **Fixed:** `AuthGate` on home, booking, ride layouts.

## What was already working (but hard to see)

- `@almosafar/maps` Leaflet map, routing, geocoding
- Shared fare engine and ride lifecycle
- localStorage repositories
- Production `next build` for all apps

## Verification

- Playwright mobile smoke tests (`npm run test:e2e`)
- Manual: `npm run dev:passenger` → login → home map → booking → confirm
