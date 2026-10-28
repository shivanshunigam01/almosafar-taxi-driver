import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { computeDriverEarnings, formatMoney } from "@almosafar/shared";
import { RideSummaryCard } from "../../components/RideSummaryCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useLocale } from "../../context/LocaleContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "RideDetail">;

export default function RideDetailScreen() {
  const { params } = useRoute<Route>();
  const { t, moneyLocale } = useLocale();
  const { ride, loading } = useRideSubscription(params.rideId);

  if (loading || !ride) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <Text style={tw`text-slate-600`}>…</Text>
      </View>
    );
  }

  const gross = ride.fareFinal?.total ?? ride.fareEstimate?.total;
  const breakdown = gross && ride.status === "completed" ? computeDriverEarnings(gross) : null;

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("trips")} />
      <View style={tw`p-5`}>
        <RideSummaryCard ride={ride} />
        {breakdown ? (
          <View style={tw`mt-4 bg-white rounded-2xl p-4 border border-slate-200`}>
            <Text style={tw`font-semibold text-slate-800`}>{t("netEarnings")}</Text>
            <Text style={tw`text-2xl font-bold text-amber-600 mt-1`}>
              {formatMoney(breakdown.driverNet, moneyLocale)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
