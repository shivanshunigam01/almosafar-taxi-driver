import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useLocale } from "../context/LocaleContext";
import type { MainTabParamList, RootStackParamList } from "./types";
import SplashScreen from "../screens/auth/SplashScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import PassengerHomeScreen from "../screens/home/PassengerHomeScreen";
import LocationPickerScreen from "../screens/booking/LocationPickerScreen";
import RoutePreviewScreen from "../screens/booking/RoutePreviewScreen";
import RideConfirmScreen from "../screens/booking/RideConfirmScreen";
import SearchingDriverScreen from "../screens/ride/SearchingDriverScreen";
import ActiveRideScreen from "../screens/ride/ActiveRideScreen";
import CancelRideScreen from "../screens/ride/CancelRideScreen";
import TripCompletedScreen from "../screens/ride/TripCompletedScreen";
import RatingScreen from "../screens/ride/RatingScreen";
import TripHistoryScreen from "../screens/history/TripHistoryScreen";
import TripDetailScreen from "../screens/history/TripDetailScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import PaymentMethodsScreen from "../screens/profile/PaymentMethodsScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { t } = useLocale();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0f766e",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={PassengerHomeScreen}
        options={{ tabBarLabel: t("home"), tabBarAccessibilityLabel: t("home") }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={TripHistoryScreen}
        options={{ tabBarLabel: t("trips"), tabBarAccessibilityLabel: t("trips") }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: t("profile"), tabBarAccessibilityLabel: t("profile") }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="RoutePreview" component={RoutePreviewScreen} />
      <Stack.Screen name="RideConfirm" component={RideConfirmScreen} />
      <Stack.Screen name="SearchingDriver" component={SearchingDriverScreen} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen name="CancelRide" component={CancelRideScreen} />
      <Stack.Screen name="TripCompleted" component={TripCompletedScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    </Stack.Navigator>
  );
}
