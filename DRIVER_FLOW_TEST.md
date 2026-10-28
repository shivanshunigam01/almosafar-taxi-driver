# Driver flow test script

1. `http://localhost:3002/welcome`
2. Login → `/dashboard` — map + header stats
3. **Go online** → incoming card with **Accept** / **Reject**
4. Accept → `/trip/[id]` — map, Navigate, PIN, advance states
5. Complete → dashboard earnings link
6. Settings — mute/unmute, test sound, reset demo

Automated: `npm run test:e2e -- --project=driver`
