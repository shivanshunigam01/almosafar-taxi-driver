import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { PrimaryButton } from "../../components/PrimaryButton";
import { selectBooking } from "../../store/bookingSlice";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList>;

export default function PassengerHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { pickup, dropoff } = useSelector(selectBooking);
  const { t } = useLocale();

  const canPreview = !!pickup && !!dropoff;

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <SyncModeNotice />
      <View style={tw`px-4 pt-4`}>
        <Text style={tw`text-2xl font-bold text-gray-900`}>{t("whereTo")}</Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>{t("planTrip")}</Text>

        <TouchableOpacity
          style={tw`bg-white border border-gray-200 rounded-lg p-4 mt-4`}
          onPress={() => navigation.navigate("LocationPicker", { field: "pickup" })}
          accessibilityRole="button"
          accessibilityLabel={t("pickup")}
        >
          <Text style={tw`text-xs text-gray-500`}>{t("pickup")}</Text>
          <Text style={tw`text-base text-gray-900 mt-1`}>
            {pickup?.label ?? t("choosePickup")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-white border border-gray-200 rounded-lg p-4 mt-3`}
          onPress={() => navigation.navigate("LocationPicker", { field: "dropoff" })}
          accessibilityRole="button"
          accessibilityLabel={t("destination")}
        >
          <Text style={tw`text-xs text-gray-500`}>{t("destination")}</Text>
          <Text style={tw`text-base text-gray-900 mt-1`}>
            {dropoff?.label ?? t("chooseDestination")}
          </Text>
        </TouchableOpacity>

        <View style={tw`mt-6`}>
          <PrimaryButton
            label={t("previewRoute")}
            disabled={!canPreview}
            onPress={() => navigation.navigate("RoutePreview")}
          />
        </View>
      </View>
    </View>
  );
}
