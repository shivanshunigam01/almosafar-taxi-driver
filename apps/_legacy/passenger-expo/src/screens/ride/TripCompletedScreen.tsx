import { Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FareBreakdownCard } from "../../components/FareBreakdownCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "TripCompleted">;
type Nav = StackNavigationProp<RootStackParamList, "TripCompleted">;

export default function TripCompletedScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { ride } = useRideSubscription(params.rideId);
  const { t } = useLocale();

  const fare = ride?.fareFinal ?? ride?.fareEstimate;

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("tripCompleted")} showBack={false} />
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-teal-800`}>{t("thankYou")}</Text>
        <Text style={tw`text-gray-600 mt-2`}>{t("mockPaymentCaptured")}</Text>
        {ride?.mockPaymentId ? (
          <View style={tw`mt-3 p-3 bg-gray-50 rounded-lg`}>
            <Text style={tw`font-semibold`}>{t("receipt")}</Text>
            <Text style={tw`text-sm text-gray-600 mt-1`}>
              {t("mockRef")}: {ride.mockPaymentId}
            </Text>
          </View>
        ) : null}
        {fare ? (
          <View style={tw`mt-4`}>
            <FareBreakdownCard breakdown={fare} isEstimate={false} />
          </View>
        ) : null}
        <View style={tw`mt-6`}>
          <PrimaryButton
            label={t("rateDriver")}
            onPress={() => navigation.replace("Rating", { rideId: params.rideId })}
          />
        </View>
        <View style={tw`mt-3`}>
          <PrimaryButton
            label={t("backHome")}
            variant="secondary"
            onPress={() => navigation.replace("MainTabs")}
          />
        </View>
      </View>
    </View>
  );
}
