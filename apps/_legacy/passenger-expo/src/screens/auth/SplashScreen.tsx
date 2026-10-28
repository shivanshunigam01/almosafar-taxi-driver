import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import type { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type Nav = StackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreenView() {
  const navigation = useNavigation<Nav>();
  const { loading, onboardingComplete, passenger } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      if (!onboardingComplete) {
        navigation.replace("Onboarding");
      } else if (!passenger) {
        navigation.replace("Login");
      } else {
        navigation.replace("MainTabs");
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [loading, onboardingComplete, passenger, navigation]);

  return (
    <View style={tw`flex-1 bg-teal-800 items-center justify-center px-8`}>
      <Image
        source={require("../../../assets/icon.png")}
        style={{ width: 120, height: 120, borderRadius: 24 }}
        accessibilityLabel="Almosafar Taxi logo"
      />
      <Text style={tw`text-white text-3xl font-bold mt-6`}>Almosafar Taxi</Text>
      <Text style={tw`text-teal-100 mt-2 text-center`}>Passenger demo application</Text>
    </View>
  );
}
