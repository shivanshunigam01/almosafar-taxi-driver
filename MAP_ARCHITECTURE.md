# Map architecture — Almosafar Taxi web apps

## Package: `@almosafar/maps`

Shared Leaflet + React Leaflet stack for **passenger** and **driver** Next.js apps. Admin does not embed live maps in this phase.

### Services (browser-safe, no React)

| Module | Role |
|--------|------|
| `GeolocationService` | `getCurrentPosition`, `watchPosition`, cleanup |
| `GeocodingService` | Preset Baghdad locations first; debounced Nominatim search with rate limiting |
| `RoutingService` | OSRM route when available; **demo_seed** curved geometry; **straight_line** fallback |
| `NavigationLinkService` | Google Maps HTTPS driving URLs, copy coordinates |
| `RouteAnimator` | Deterministic marker animation along polyline (demo only) |

### React exports (`@almosafar/maps/react`)

| Component | Role |
|-----------|------|
| `MapProvider` | Config + service instances |
| `MapView` | Full-screen / embedded map, tile layer, optional `fitPoints` |
| `LocationSearch` | Text search with presets |
| `PickupSelector` / `DestinationSelector` | Draggable markers |
| `PassengerMarker` / `DriverMarker` | User / driver position |
| `RoutePreviewLayer` | Polyline with source-based styling |
| `RecenterControl` / `ZoomControls` | Must be children of `MapView` |

### Configuration

Environment overrides (optional):

- `NEXT_PUBLIC_MAP_TILE_URL`
- `NEXT_PUBLIC_OSRM_URL` (default: public OSRM demo router)
- `NEXT_PUBLIC_NOMINATIM_URL`
- `NEXT_PUBLIC_MAP_USER_AGENT` (required etiquette for Nominatim)

**Production note:** Public OSM/Nominatim/OSRM endpoints are for **demo volume only**. Use self-hosted or contracted providers for production APK traffic.

### SSR

Map components are loaded with `next/dynamic` and `{ ssr: false }` in apps. Do not import Leaflet in server components.

### Fallback behaviour

1. OSRM success → real road geometry, labelled in UI when attribution is set.
2. OSRM failure → seeded demo curve (`demo_seed`) with explicit warning.
3. Last resort → straight-line estimate with warning.

### Tests

- `packages/maps/src/__tests__/navigation-link.test.ts`
- `packages/maps/src/__tests__/routing-fallback.test.ts`

Run: `npm run test -w @almosafar/maps`
