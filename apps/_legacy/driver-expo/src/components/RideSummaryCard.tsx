import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useLocale } from "../context/LocaleContext";

export function RideSummaryCard({
  ride,
  passengerName,
}: {
  ride: Ride;
  passengerName?: string;
}) {
  const { t, moneyLocale } = useLocale();
  const fare = ride.fareEstimate?.total;

  return (
    <View style={tw`bg-white rounded-2xl p-4 border border-slate-200 shadow-sm`}>
      {passengerName ? (
        <Text style={tw`text-sm text-slate-500`}>{t("passenger")}</Text>
      ) : null}
      {passengerName ? (
        <Text style={tw`text-lg font-bold text-slate-900 mb-3`}>{passengerName}</Text>
      ) : null}
      <Text style={tw`text-xs text-slate-500 uppercase`}>{t("pickup")}</Text>
      <Text style={tw`text-base text-slate-800 mb-2`}>{ride.pickup.label}</Text>
      <Text style={tw`text-xs text-slate-500 uppercase`}>{t("dropoff")}</Text>
      <Text style={tw`text-base text-slate-800 mb-2`}>{ride.dropoff.label}</Text>
      {ride.fareEstimate ? (
        <>
          <Text style={tw`text-xs text-slate-500 uppercase mt-1`}>{t("distance")}</Text>
          <Text style={tw`text-base text-slate-800`}>
            {ride.fareEstimate.distanceKm.toFixed(1)} km
          </Text>
          {fare ? (
            <>
              <Text style={tw`text-xs text-slate-500 uppercase mt-2`}>{t("estimatedFare")}</Text>
              <Text style={tw`text-xl font-bold text-amber-600`}>
                {formatMoney(fare, moneyLocale)}
              </Text>
            </>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
