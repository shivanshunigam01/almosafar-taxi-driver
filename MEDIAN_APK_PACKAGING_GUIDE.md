# Median.co WebView APK packaging

## Prerequisites

1. Deploy **passenger** and **driver** to **separate HTTPS URLs** (see `DEPLOYMENT_GUIDE.md`).
2. Confirm each site works in mobile Chrome/Safari without localhost.

## Recommended Median setup

| App | Suggested app name | Start URL |
|-----|-------------------|-----------|
| Almosafar Passenger | Almosafar Passenger | `https://your-passenger-domain/` |
| Almosafar Driver | Almosafar Driver | `https://your-driver-domain/` |

Use **two separate** Median projects — one APK per role.

## Web app readiness (already in codebase)

- Mobile viewport + `viewportFit: cover` in layouts
- Touch-friendly controls, max-width mobile shell
- Demo banners explaining local-only storage
- No Expo or native module dependencies
- Leaflet maps (requires network for OSM tiles)

## Not available in WebView demo

- Native push notifications
- Background GPS / turn-by-turn native navigation
- Cross-app realtime sync without a backend

## Testing before packaging

1. Open deployed passenger URL on Android Chrome — full booking flow.
2. Open deployed driver URL — go online, accept **simulated** request.
3. Verify demo disclaimers visible on first screen.
