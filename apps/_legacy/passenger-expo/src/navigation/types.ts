export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  LocationPicker: { field: "pickup" | "dropoff" };
  RoutePreview: undefined;
  RideConfirm: undefined;
  SearchingDriver: { rideId: string };
  ActiveRide: { rideId: string };
  CancelRide: { rideId: string };
  TripCompleted: { rideId: string };
  Rating: { rideId: string };
  TripDetail: { rideId: string };
  Settings: undefined;
  PaymentMethods: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
