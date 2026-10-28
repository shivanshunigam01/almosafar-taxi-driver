import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  PASSENGER_VEHICLE_CATEGORIES,
  VEHICLE_CATEGORY_LABELS,
  type VehicleCategory,
} from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { RouteMapView } from "../../components/RouteMapView";
import { FareBreakdownCard } from "../../components/FareBreakdownCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useFareEstimate } from "../../hooks/useFareEstimate";
import { selectBooking, setCategory } from "../../store/bookingSlice";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList, "RoutePreview">;

export default function RoutePreviewScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { t, locale } = useLocale();
  const { pickup, dropoff, category } = useSelector(selectBooking);
  const { breakdown, loading, error } = useFareEstimate(pickup, dropoff, category);

  if (!pickup || !dropoff) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <ScreenHeader title={t("routePreview")} />
        <Text style={tw`p-4 text-gray-600`}>{t("choosePickup")}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("routePreview")} />
      <View style={tw`h-56`}>
        <RouteMapView pickup={pickup} dropoff={dropoff} />
      </View>
      <ScrollView contentContainerStyle={tw`p-4 pb-8`}>
        <Text style={tw`text-sm text-gray-600`}>{pickup.label}</Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>→ {dropoff.label}</Text>

        <Text style={tw`font-semibold text-gray-900 mt-4 mb-2`}>{t("rideCategory")}</Text>
        <View style={tw`flex-row flex-wrap`}>
          {PASSENGER_VEHICLE_CATEGORIES.map((cat) => {
            const selected = category === cat;
            const label =
              locale === "ar"
                ? VEHICLE_CATEGORY_LABELS[cat].ar
                : VEHICLE_CATEGORY_LABELS[cat].en;
            return (
              <Pressable
                key={cat}
                onPress={() => dispatch(setCategory(cat as VehicleCategory))}
                style={tw`mr-2 mb-2 px-4 py-2 rounded-full ${
                  selected ? "bg-teal-700" : "bg-gray-200"
                }`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text style={tw`${selected ? "text-white" : "text-gray-900"}`}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {loading ? <Text style={tw`mt-4 text-gray-600`}>{t("calculating")}</Text> : null}
        {error ? <Text style={tw`mt-4 text-red-600`}>{error}</Text> : null}
        {breakdown ? (
          <View style={tw`mt-4`}>
            <FareBreakdownCard breakdown={breakdown} isEstimate />
          </View>
        ) : null}

        <View style={tw`mt-6`}>
          <PrimaryButton
            label={t("continueConfirm")}
            disabled={!breakdown}
            onPress={() => navigation.navigate("RideConfirm")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
