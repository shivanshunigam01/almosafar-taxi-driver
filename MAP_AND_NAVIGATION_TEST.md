# Map and navigation test script

## Map stack

- Package: `@almosafar/maps` (Leaflet, OSM tiles, OSRM routing fallback)
- Dynamic import `{ ssr: false }` on map pages

## Tests

| Case | Steps | Pass criteria |
|------|--------|----------------|
| Tiles load | Open passenger `/home` | Leaflet attribution visible |
| GPS denied | Deny geolocation | Amber banner; Baghdad preset still works |
| Route | Pickup + dropoff | Distance/minutes + polyline |
| Recenter | Tap ◎ | Map moves |
| Google Nav (driver) | Trip → Navigate | Opens `google.com/maps/dir` |
| Unit tests | `npm run test -w @almosafar/maps` | 3/3 |

## Config (optional env)

- `NEXT_PUBLIC_MAP_TILE_URL`
- `NEXT_PUBLIC_OSRM_URL`
- `NEXT_PUBLIC_NOMINATIM_URL`
