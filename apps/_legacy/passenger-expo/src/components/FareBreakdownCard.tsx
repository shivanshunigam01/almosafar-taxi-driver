import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { formatMoney, type Money, type RideFareBreakdown } from "@almosafar/shared";

export function FareBreakdownCard({
  breakdown,
  isEstimate,
}: {
  breakdown: RideFareBreakdown;
  isEstimate: boolean;
}) {
  const row = (label: string, money: Money) => (
    <View style={tw`flex-row justify-between py-1`} key={label}>
      <Text style={tw`text-gray-600 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-900 text-sm`}>{formatMoney(money)}</Text>
    </View>
  );

  return (
    <View style={tw`bg-white border border-gray-200 rounded-lg p-4`}>
      <Text style={tw`text-base font-bold text-gray-900`}>
        {isEstimate ? "Estimated fare (not final)" : "Fare summary"}
      </Text>
      {isEstimate ? (
        <Text style={tw`text-xs text-amber-700 mt-1`}>
          Final amount is confirmed only after trip completion.
        </Text>
      ) : null}

      <View style={tw`mt-3`}>
        {row("Base fare", breakdown.baseFare)}
        {row(
          `Distance (${breakdown.distanceKm.toFixed(1)} km)`,
          breakdown.distanceComponent
        )}
        {row(
          `Time (${breakdown.durationMinutes} min)`,
          breakdown.timeComponent
        )}
        {row("Fees", breakdown.bookingFee)}
        {breakdown.surgeComponent ? row("Surge", breakdown.surgeComponent) : null}
        {breakdown.discountComponent ? (
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-gray-600 text-sm`}>Discount</Text>
            <Text style={tw`text-green-700 text-sm`}>
              −{formatMoney(breakdown.discountComponent)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={tw`border-t border-gray-200 mt-3 pt-3 flex-row justify-between`}>
        <Text style={tw`font-bold text-gray-900`}>
          {isEstimate ? "Estimated total" : "Total paid (mock)"}
        </Text>
        <Text style={tw`font-bold text-teal-800 text-lg`}>
          {formatMoney(breakdown.total)}
        </Text>
      </View>
    </View>
  );
}
