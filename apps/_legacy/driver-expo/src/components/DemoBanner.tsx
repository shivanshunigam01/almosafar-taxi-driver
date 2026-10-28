import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { DEMO_BANNER_LABEL, DEMO_DISCLAIMER } from "@almosafar/shared";

export function DemoBanner() {
  return (
    <View
      style={tw`bg-slate-900 px-4 py-3 border-b-4 border-amber-500`}
      accessibilityRole="text"
      accessibilityLabel={`${DEMO_BANNER_LABEL}. ${DEMO_DISCLAIMER}`}
    >
      <Text style={tw`text-white font-bold text-sm`}>{DEMO_BANNER_LABEL}</Text>
      <Text style={tw`text-slate-200 text-xs mt-1 leading-5`}>{DEMO_DISCLAIMER}</Text>
    </View>
  );
}
