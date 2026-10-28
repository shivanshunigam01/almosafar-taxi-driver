import { Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { computeDriverEarnings, formatMoney } from "@almosafar/shared";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useLocale } from "../../context/LocaleContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "TripReceipt">;
type Nav = StackNavigationProp<RootStackParamList, "TripReceipt">;

export default function TripReceiptScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
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
  const breakdown = gross ? computeDriverEarnings(gross) : null;

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("tripReceipt")} />
      <View style={tw`p-5`}>
        <View style={tw`bg-white rounded-2xl p-5 border border-slate-200`}>
          <Text style={tw`text-sm text-slate-500`}>{ride.pickup.label}</Text>
          <Text style={tw`text-slate-400 my-1`}>↓</Text>
          <Text style={tw`text-sm text-slate-500`}>{ride.dropoff.label}</Text>

          {breakdown ? (
            <View style={tw`mt-6 border-t border-slate-100 pt-4`}>
              <Row label={t("grossFare")} value={formatMoney(breakdown.gross, moneyLocale)} />
              <Row
                label={t("commission")}
                value={`-${formatMoney(breakdown.platformCommission, moneyLocale)}`}
                muted
              />
              <Row
                label={t("netEarnings")}
                value={formatMoney(breakdown.driverNet, moneyLocale)}
                highlight
              />
              <Text style={tw`text-xs text-slate-500 mt-4`}>{t("demoCalcNote")}</Text>
            </View>
          ) : null}
        </View>
        <View style={tw`mt-6`}>
          <PrimaryButton label={t("home")} onPress={() => navigation.navigate("MainTabs")} />
        </View>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <View style={tw`flex-row justify-between py-2`}>
      <Text style={tw`text-slate-600`}>{label}</Text>
      <Text
        style={tw`${highlight ? "text-amber-600 font-bold text-lg" : muted ? "text-slate-500" : "text-slate-900 font-semibold"}`}
      >
        {value}
      </Text>
    </View>
  );
}
