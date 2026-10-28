import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList>;

export default function DriverProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { driver, logout, isOnline } = useAuth();
  const { t } = useLocale();

  const link = (label: string, route: keyof RootStackParamList) => (
    <Pressable
      onPress={() => navigation.navigate(route as never)}
      style={tw`py-4 border-b border-slate-100`}
    >
      <Text style={tw`text-base text-slate-800 font-medium`}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={tw`flex-1 bg-white pt-12 px-5`}>
      <Text style={tw`text-2xl font-bold text-slate-900`}>{t("profile")}</Text>
      <Text style={tw`text-lg text-slate-700 mt-2`}>{driver?.displayName}</Text>
      <Text style={tw`text-sm text-slate-500`}>{driver?.email}</Text>
      <Text style={tw`text-sm mt-2`}>
        {isOnline ? t("online") : t("offline")}
      </Text>

      <View style={tw`mt-4`}>
        <SyncModeNotice />
      </View>

      <View style={tw`mt-6 bg-slate-50 rounded-2xl px-4`}>
        {link(t("vehicle"), "VehicleDetails")}
        {link(t("notifications"), "Notifications")}
        {link(t("settings"), "Settings")}
      </View>

      <View style={tw`mt-8`}>
        <PrimaryButton
          label={t("signOut")}
          variant="danger"
          onPress={async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }}
        />
      </View>
    </View>
  );
}
