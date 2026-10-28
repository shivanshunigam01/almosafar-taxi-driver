import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import type { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type Nav = StackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreenView() {
  const navigation = useNavigation<Nav>();
  const { loading, driver } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      if (!driver) {
        navigation.replace("Login");
      } else {
        navigation.replace("MainTabs");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [loading, driver, navigation]);

  return (
    <View style={tw`flex-1 bg-slate-900 items-center justify-center px-8`}>
      <Image
        source={require("../../../assets/icon.png")}
        style={{ width: 120, height: 120, borderRadius: 24 }}
        accessibilityLabel="Almosafar Driver logo"
      />
      <Text style={tw`text-amber-400 text-3xl font-bold mt-6`}>{t("driverAppTitle")}</Text>
      <Text style={tw`text-slate-300 mt-2 text-center`}>{t("driverAppSubtitle")}</Text>
    </View>
  );
}
