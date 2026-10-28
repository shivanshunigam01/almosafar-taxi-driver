# Driver notification sound

## Location

- `apps/driver/src/lib/notification-sound.ts`
- `apps/driver/src/hooks/useIncomingRideAlert.ts`
- Settings: `/settings`

## Behaviour

1. When **online** and a ride is `requested`, optional repeating Web Audio tone (880 Hz beep).
2. Stops on accept, reject, offline, or when no pending request.
3. **Enable & test sound** unlocks autoplay (browser gesture requirement).
4. Preferences in localStorage key `almosafar.driver.notificationPrefs`:
   - `soundEnabled`, `muted`, `volume`

## Autoplay

Browsers block audio until user interaction. Driver must tap **Go online** or **Enable & test sound** first.

## Median / WebView

Background or suspended WebView may not play repeating alerts. Visual incoming card remains the primary signal. Native push is **not** implemented.

## Silent fallback

If muted or sound disabled, the high-contrast incoming request card and countdown still show.
