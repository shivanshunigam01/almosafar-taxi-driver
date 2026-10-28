# Localhost demo guide

## Start (three terminals or one)

```bash
cd "C:\Users\Admin\Desktop\uber clone"
npm install
npm run dev:admin      # http://localhost:3000
npm run dev:passenger  # http://localhost:3001
npm run dev:driver     # http://localhost:3002
```

Or: `npm run dev:all` (needs ~4GB free RAM for three Next.js compilers).

**Windows tip:** If `dev:all` crashes with out-of-memory, open **three terminals**:

```bash
npm run dev:admin
npm run dev:passenger
npm run dev:driver
```

Each app dev script uses a 4GB Node heap limit.

**Low RAM:** build then run production servers (lighter than three `next dev`):

```bash
npm run build -w @almosafar/passenger && npm run start -w @almosafar/passenger
npm run build -w @almosafar/driver && npm run start -w @almosafar/driver
npm run build -w @almosafar/admin && npm run start -w @almosafar/admin
```

E2E against running servers (PowerShell):

```powershell
$env:PW_SKIP_WEBSERVER="1"; npm run test:e2e
```

## Passenger demo (port 3001)

1. Open `/` → splash → `/welcome`
2. **Register** or **Sign in** (`demo.passenger.sara@example.com`, any password)
3. OTP (if registered): `123456`
4. **Home map** — expand sheet, pick destination, **Choose ride**
5. Vehicle + fare → **Continue** → **Confirm ride**
6. Watch searching → active trip → receipt / rating

## Driver demo (port 3002)

1. `/welcome` → sign in (`demo.driver.khalid@example.com`)
2. **Settings** → Enable & test sound
3. **Go online** → **Accept** simulated request
4. **Navigate** → advance trip → complete

## Admin (port 3000)

1. `/login` — email containing `admin`, any password
2. Dashboard, fares, rides, settings (JSON export)

## Clear demo data

- Passenger/Driver settings → Reset local demo
- Or DevTools → Application → Local Storage → clear origin keys

## Cross-app limitation

Port 3001 and 3002 **do not** share rides. Labels say “simulated” / “local demo” throughout.
