export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  IncomingRide: { rideId: string };
  ActiveTrip: { rideId: string };
  TripReceipt: { rideId: string };
  RideDetail: { rideId: string };
  Notifications: undefined;
  Settings: undefined;
  VehicleDetails: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  EarningsTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
