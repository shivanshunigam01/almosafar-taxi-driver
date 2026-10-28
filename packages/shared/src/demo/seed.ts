import { createDemoId } from "../constants/ids";
import { fareConfigFromMajorRates } from "../fare/calculator";
import type {
  AdminConfiguration,
  DemoActivity,
  Driver,
  FareConfiguration,
  MockPaymentRecord,
  Passenger,
  PaymentMethod,
  Rating,
  ServiceZone,
  TripHistoryEntry,
  Vehicle,
} from "../schemas/entities";
import type { OperationalSettings } from "../schemas/admin-ops";
import { operationalSettingsSchema } from "../schemas/admin-ops";
import type { Ride } from "../schemas/ride";

const T0 = "2026-01-15T08:00:00+03:00";

export const demoZone: ServiceZone = {
  id: createDemoId("zone_baghdad"),
  name: "Baghdad Demo Zone",
  bounds: {
    northEast: { latitude: 33.45, longitude: 44.55 },
    southWest: { latitude: 33.2, longitude: 44.2 },
  },
  isActive: true,
  currency: "IQD",
  createdAt: T0,
  updatedAt: T0,
  isDemoData: true,
};

export const demoPassengers: Passenger[] = [
  {
    id: createDemoId("passenger_sara"),
    displayName: "Demo Passenger — Sara A.",
    phoneE164: "+966500000001",
    email: "demo.passenger.sara@example.com",
    ratingAverage: 4.9,
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
  {
    id: createDemoId("passenger_omar"),
    displayName: "Demo Passenger — Omar H.",
    phoneE164: "+966500000002",
    email: "demo.passenger.omar@example.com",
    ratingAverage: 4.7,
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
];

export const demoDrivers: Driver[] = [
  {
    id: createDemoId("driver_khalid"),
    displayName: "Demo Driver — Khalid M.",
    email: "demo.driver.khalid@example.com",
    phoneE164: "+9647700000001",
    licenseNumber: "DEMO-LIC-001",
    isOnline: true,
    currentLocation: {
      geo: { latitude: 33.3152, longitude: 44.3661 },
      updatedAt: T0,
    },
    ratingAverage: 4.95,
    vehicleId: createDemoId("vehicle_camry_khalid"),
    verificationStatus: "verified",
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
  {
    id: createDemoId("driver_layla"),
    displayName: "Demo Driver — Layla R.",
    email: "demo.driver.layla@example.com",
    phoneE164: "+9647700000002",
    licenseNumber: "DEMO-LIC-002",
    isOnline: false,
    ratingAverage: 4.88,
    vehicleId: createDemoId("vehicle_sonata_layla"),
    verificationStatus: "pending",
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
];

export const demoVehicles: Vehicle[] = [
  {
    id: createDemoId("vehicle_camry_khalid"),
    driverId: createDemoId("driver_khalid"),
    category: "comfort",
    make: "Toyota",
    model: "Camry",
    color: "White",
    plateNumber: "DEMO-1234",
    year: 2023,
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
  {
    id: createDemoId("vehicle_sonata_layla"),
    driverId: createDemoId("driver_layla"),
    category: "economy",
    make: "Hyundai",
    model: "Sonata",
    color: "Silver",
    plateNumber: "DEMO-5678",
    year: 2022,
    createdAt: T0,
    updatedAt: T0,
    isDemoData: true,
  },
];

export const demoFareConfigurations: FareConfiguration[] = [
  fareConfigFromMajorRates({
    id: createDemoId("fare_economy_baghdad"),
    zoneId: demoZone.id,
    category: "economy",
    currency: "IQD",
    baseFareMajor: 3000,
    perKmMajor: 750,
    perMinuteMajor: 200,
    minimumFareMajor: 5000,
    bookingFeeMajor: 500,
    surgeMultiplier: 1,
    discountPercent: 0,
    isActive: true,
    effectiveFrom: T0,
    updatedAt: T0,
    isDemoData: true,
  }),
  fareConfigFromMajorRates({
    id: createDemoId("fare_comfort_baghdad"),
    zoneId: demoZone.id,
    category: "comfort",
    currency: "IQD",
    baseFareMajor: 4500,
    perKmMajor: 950,
    perMinuteMajor: 250,
    minimumFareMajor: 7000,
    bookingFeeMajor: 600,
    surgeMultiplier: 1,
    discountPercent: 10,
    isActive: true,
    effectiveFrom: T0,
    updatedAt: T0,
    isDemoData: true,
  }),
  fareConfigFromMajorRates({
    id: createDemoId("fare_premium_baghdad"),
    zoneId: demoZone.id,
    category: "premium",
    currency: "IQD",
    baseFareMajor: 6500,
    perKmMajor: 1200,
    perMinuteMajor: 320,
    minimumFareMajor: 10000,
    bookingFeeMajor: 800,
    surgeMultiplier: 1,
    discountPercent: 0,
    isActive: true,
    effectiveFrom: T0,
    updatedAt: T0,
    isDemoData: true,
  }),
  fareConfigFromMajorRates({
    id: createDemoId("fare_xl_baghdad"),
    zoneId: demoZone.id,
    category: "xl",
    currency: "IQD",
    baseFareMajor: 5500,
    perKmMajor: 1050,
    perMinuteMajor: 280,
    minimumFareMajor: 8500,
    bookingFeeMajor: 650,
    surgeMultiplier: 1,
    discountPercent: 5,
    isActive: true,
    effectiveFrom: T0,
    updatedAt: T0,
    isDemoData: true,
  }),
];

export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: createDemoId("pm_cash_sara"),
    passengerId: createDemoId("passenger_sara"),
    type: "cash",
    label: "Demo — Cash",
    isDefault: true,
    isDemoData: true,
  },
  {
    id: createDemoId("pm_card_mock_sara"),
    passengerId: createDemoId("passenger_sara"),
    type: "card_mock",
    label: "Demo Card · Mock",
    mockLastFour: "4242",
    isDefault: false,
    isDemoData: true,
  },
];

export const demoOperationalSettings: OperationalSettings = operationalSettingsSchema.parse({
  id: createDemoId("ops_settings"),
  defaultRegionLabel: "Baghdad, Iraq",
  defaultCurrency: "IQD",
  driverCommissionRate: 0.15,
  cancellationChargeMinor: 250000,
  peakHourRules: [
    {
      id: createDemoId("peak_morning"),
      label: "Baghdad morning peak (demo)",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startHour: 7,
      endHour: 10,
      multiplier: 1.25,
      isActive: true,
      isDemoData: true,
    },
    {
      id: createDemoId("peak_evening"),
      label: "Baghdad evening peak (demo)",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startHour: 16,
      endHour: 20,
      multiplier: 1.35,
      isActive: true,
      isDemoData: true,
    },
  ],
  surgeRules: [
    {
      id: createDemoId("surge_zone_core"),
      zoneId: demoZone.id,
      label: "Central Baghdad demand (demo)",
      multiplier: 1.2,
      triggerNote: "Illustrative surge — not live demand data",
      isActive: false,
      isDemoData: true,
    },
  ],
  updatedAt: T0,
  isDemoData: true,
});

export const demoAdminConfiguration: AdminConfiguration = {
  id: createDemoId("admin_config"),
  appName: "Almosafar Taxi Admin (Demo)",
  supportEmail: "demo-support@example.com",
  defaultZoneId: demoZone.id,
  demoModeEnforced: true,
  maintenanceMode: false,
  updatedAt: T0,
  isDemoData: true,
};

export const demoActivities: DemoActivity[] = [
  {
    id: createDemoId("activity_1"),
    type: "ride_created",
    message: "Demo ride requested by Sara A. (sample data)",
    entityRef: createDemoId("ride_active"),
    occurredAt: "2026-01-15T09:10:00+03:00",
    isDemoData: true,
  },
  {
    id: createDemoId("activity_2"),
    type: "driver_went_online",
    message: "Demo driver Khalid M. marked online",
    entityRef: createDemoId("driver_khalid"),
    occurredAt: "2026-01-15T09:00:00+03:00",
    isDemoData: true,
  },
];

const pickup = {
  label: "Demo — Tahrir Square, Baghdad",
  geo: { latitude: 33.3152, longitude: 44.3661 },
};
const dropoff = {
  label: "Demo — Baghdad International Airport (BGW)",
  geo: { latitude: 33.2625, longitude: 44.2346 },
};

function demoFareStub(totalMinor: number, distanceKm: number, durationMinutes: number) {
  return {
    baseFare: { currency: "IQD" as const, amountMinor: 150000 },
    distanceComponent: { currency: "IQD" as const, amountMinor: 180000 },
    timeComponent: { currency: "IQD" as const, amountMinor: 60000 },
    bookingFee: { currency: "IQD" as const, amountMinor: 0 },
    total: { currency: "IQD" as const, amountMinor: totalMinor },
    distanceKm,
    durationMinutes,
    fareConfigId: createDemoId("fare_config_economy"),
    computedAt: T0,
  };
}

const saraId = createDemoId("passenger_sara");
const khalidId = createDemoId("driver_khalid");
const laylaId = createDemoId("driver_layla");
const camryId = createDemoId("vehicle_camry_khalid");

/** Sample rides — for demo sync UIs only. */
export const demoRides: Ride[] = [
  {
    id: createDemoId("ride_completed_sara_1"),
    passengerId: saraId,
    driverId: khalidId,
    vehicleId: camryId,
    zoneId: demoZone.id,
    category: "economy",
    status: "completed",
    pickup: {
      label: "Demo — Al-Mansour, Baghdad",
      geo: { latitude: 33.312, longitude: 44.329 },
    },
    dropoff: {
      label: "Demo — Al-Karrada, Baghdad",
      geo: { latitude: 33.2958, longitude: 44.3859 },
    },
    statusHistory: [
      {
        status: "requested",
        at: "2026-01-12T14:00:00+03:00",
        actorId: saraId,
        actorRole: "passenger",
      },
      {
        status: "completed",
        at: "2026-01-12T14:45:00+03:00",
        actorId: khalidId,
        actorRole: "driver",
      },
    ],
    paymentMethodId: createDemoId("pm_cash_sara"),
    requestedAt: "2026-01-12T14:00:00+03:00",
    updatedAt: "2026-01-12T14:45:00+03:00",
    completedAt: "2026-01-12T14:45:00+03:00",
    fareEstimate: demoFareStub(390000, 8.2, 22),
    fareFinal: demoFareStub(390000, 8.2, 22),
    isDemoData: true,
  },
  {
    id: createDemoId("ride_completed_sara_2"),
    passengerId: saraId,
    driverId: laylaId,
    zoneId: demoZone.id,
    category: "comfort",
    status: "completed",
    pickup: {
      label: "Demo — Jadriyah, Baghdad",
      geo: { latitude: 33.277, longitude: 44.407 },
    },
    dropoff: {
      label: "Demo — Al-Mutanabbi Street, Baghdad",
      geo: { latitude: 33.3406, longitude: 44.3925 },
    },
    statusHistory: [
      {
        status: "requested",
        at: "2026-01-10T09:30:00+03:00",
        actorId: saraId,
        actorRole: "passenger",
      },
      {
        status: "completed",
        at: "2026-01-10T10:05:00+03:00",
        actorId: laylaId,
        actorRole: "driver",
      },
    ],
    paymentMethodId: createDemoId("pm_cash_sara"),
    requestedAt: "2026-01-10T09:30:00+03:00",
    updatedAt: "2026-01-10T10:05:00+03:00",
    completedAt: "2026-01-10T10:05:00+03:00",
    fareEstimate: demoFareStub(500000, 11.4, 28),
    fareFinal: demoFareStub(500000, 11.4, 28),
    isDemoData: true,
  },
  {
    id: createDemoId("ride_active"),
    passengerId: saraId,
    driverId: khalidId,
    vehicleId: camryId,
    zoneId: demoZone.id,
    category: "comfort",
    status: "driver_arriving",
    pickup,
    dropoff,
    statusHistory: [
      {
        status: "requested",
        at: "2026-01-15T09:10:00+03:00",
        actorId: createDemoId("passenger_sara"),
        actorRole: "passenger",
      },
      {
        status: "accepted",
        at: "2026-01-15T09:12:00+03:00",
        actorId: createDemoId("driver_khalid"),
        actorRole: "driver",
      },
      {
        status: "driver_arriving",
        at: "2026-01-15T09:18:00+03:00",
        actorId: createDemoId("driver_khalid"),
        actorRole: "driver",
      },
    ],
    paymentMethodId: createDemoId("pm_cash_sara"),
    requestedAt: "2026-01-15T09:10:00+03:00",
    updatedAt: "2026-01-15T09:18:00+03:00",
    isDemoData: true,
  },
];

export const demoTripHistory: TripHistoryEntry[] = [
  {
    id: createDemoId("trip_history_1"),
    rideId: createDemoId("ride_completed_1"),
    passengerId: createDemoId("passenger_omar"),
    driverId: createDemoId("driver_layla"),
    pickup: {
      label: "Demo — Al-Karrada, Baghdad",
      geo: { latitude: 33.2958, longitude: 44.3859 },
    },
    dropoff: {
      label: "Demo — Al-Mutanabbi Street, Baghdad",
      geo: { latitude: 33.3406, longitude: 44.3925 },
    },
    completedAt: "2026-01-14T20:30:00+03:00",
    fareTotal: { currency: "IQD", amountMinor: 420000 },
    vehicleCategory: "economy",
    isDemoData: true,
  },
];

export const demoRatings: Rating[] = [
  {
    id: createDemoId("rating_1"),
    rideId: createDemoId("ride_completed_1"),
    fromPassengerId: createDemoId("passenger_omar"),
    toDriverId: createDemoId("driver_layla"),
    score: 5,
    comment: "Demo feedback — smooth trip sample.",
    createdAt: "2026-01-14T20:35:00+03:00",
    isDemoData: true,
  },
];

export const demoMockPayments: MockPaymentRecord[] = [
  {
    id: createDemoId("payment_mock_1"),
    rideId: createDemoId("ride_completed_1"),
    passengerId: createDemoId("passenger_omar"),
    paymentMethodId: createDemoId("pm_cash_sara"),
    status: "captured_mock",
    amount: { currency: "IQD", amountMinor: 420000 },
    mockProcessorReference: "MOCK-REF-DEMO-0001",
    createdAt: "2026-01-14T20:31:00+03:00",
    updatedAt: "2026-01-14T20:31:00+03:00",
    isDemoData: true,
  },
];

export interface DemoSeedBundle {
  zone: ServiceZone;
  passengers: Passenger[];
  drivers: Driver[];
  vehicles: Vehicle[];
  fareConfigurations: FareConfiguration[];
  paymentMethods: PaymentMethod[];
  adminConfiguration: AdminConfiguration;
  operationalSettings: OperationalSettings;
  activities: DemoActivity[];
  rides: Ride[];
  tripHistory: TripHistoryEntry[];
  ratings: Rating[];
  mockPayments: MockPaymentRecord[];
}

export function getDemoSeedBundle(): DemoSeedBundle {
  return {
    zone: demoZone,
    passengers: demoPassengers,
    drivers: demoDrivers,
    vehicles: demoVehicles,
    fareConfigurations: demoFareConfigurations,
    paymentMethods: demoPaymentMethods,
    adminConfiguration: demoAdminConfiguration,
    operationalSettings: demoOperationalSettings,
    activities: demoActivities,
    rides: demoRides,
    tripHistory: demoTripHistory,
    ratings: demoRatings,
    mockPayments: demoMockPayments,
  };
}
