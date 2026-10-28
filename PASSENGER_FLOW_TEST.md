# Passenger flow test script

1. `http://localhost:3001/welcome` — branding visible (not blank black page)
2. Register → OTP `123456` → `/home`
3. Map fills screen; bottom sheet shows **Where to?**
4. Tap recent destination → **Choose ride** (not hidden behind nav)
5. `/booking/route` — vehicle cards + fare breakdown + map strip
6. Continue → payment method selection + **Confirm ride**
7. Searching spinner → active ride map + driver card
8. Completed → receipt → rating
9. Profile → sign out → `/login`

Automated: `npm run test:e2e -- --project=passenger`
