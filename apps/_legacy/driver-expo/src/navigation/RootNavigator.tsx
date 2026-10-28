import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useLocale } from "../context/LocaleContext";
import type { MainTabParamList, RootStackParamList } from "./types";
import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import DriverHomeScreen from "../screens/home/DriverHomeScreen";
import IncomingRideScreen from "../screens/dispatch/IncomingRideScreen";
import ActiveTripScreen from "../screens/trip/ActiveTripScreen";
import TripReceiptScreen from "../screens/trip/TripReceiptScreen";
import RideHistoryScreen from "../screens/history/RideHistoryScreen";
import RideDetailScreen from "../screens/history/RideDetailScreen";
import EarningsScreen from "../screens/earnings/EarningsScreen";
import DriverProfileScreen from "../screens/profile/DriverProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import NotificationsScreen from "../screens/profile/NotificationsScreen";
import VehicleDetailsScreen from "../screens/profile/VehicleDetailsScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { t } = useLocale();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f59e0b",
        tabBarStyle: { backgroundColor: "#0f172a" },
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DriverHomeScreen}
        options={{ tabBarLabel: t("home") }}
      />
      <Tab.Screen
        name="EarningsTab"
        component={EarningsScreen}
        options={{ tabBarLabel: t("earnings") }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={RideHistoryScreen}
        options={{ tabBarLabel: t("trips") }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={DriverProfileScreen}
        options={{ tabBarLabel: t("profile") }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="IncomingRide" component={IncomingRideScreen} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
      <Stack.Screen name="TripReceipt" component={TripReceiptScreen} />
      <Stack.Screen name="RideDetail" component={RideDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
}
