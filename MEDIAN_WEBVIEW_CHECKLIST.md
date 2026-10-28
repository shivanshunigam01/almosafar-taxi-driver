# Median.co WebView checklist

Use separate deployed URLs for **Passenger** and **Driver** (see `DEPLOYMENT_GUIDE.md`).

## Ready in current web build

- [x] Mobile viewport + `viewportFit: cover`
- [x] Safe-area padding (`env(safe-area-inset-bottom)`)
- [x] Touch-friendly controls (44px+ targets on primary actions)
- [x] HTTPS-ready static/SSR Next.js output
- [x] No localhost hard dependency
- [x] localStorage demo persistence
- [x] External Google Maps navigation (`https://www.google.com/maps/dir/...`)
- [x] Map tiles via configurable HTTPS URLs
- [x] Distinct `applicationName` / metadata per app

## Configure in Median.co

- [ ] **External URL allowlist** — Google Maps, OSM tile CDN, OSRM/Nominatim if used in production
- [ ] **Geolocation permission** — WebView location for GPS dot
- [ ] **Separate apps** — one Median app per URL (passenger vs driver)
- [ ] App icon / splash from `public/` assets

## May need native plugins or extra config

- [ ] Background GPS / always-on location
- [ ] Push notifications for incoming rides
- [ ] Reliable audio when app is backgrounded
- [ ] Deep link return from Google Maps app
- [ ] High-volume routing/geocoding (self-hosted OSRM/Nominatim)

## Not claimed

- Cross-device live dispatch
- Native turn-by-turn inside WebView
- Offline map tiles (network required for first load)
