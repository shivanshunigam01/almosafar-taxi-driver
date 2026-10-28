import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { DEMO_BANNER_LABEL, DEMO_DISCLAIMER } from "@almosafar/shared";

export function DemoBanner() {
  return (
    <View
      style={tw`bg-blue-900 px-4 py-3 border-b-4 border-yellow-500`}
      accessibilityRole="text"
      accessibilityLabel={`${DEMO_BANNER_LABEL}. ${DEMO_DISCLAIMER}`}
    >
      <Text style={tw`text-white font-bold text-sm`}>{DEMO_BANNER_LABEL}</Text>
      <Text style={tw`text-white text-xs mt-1 leading-5`}>{DEMO_DISCLAIMER}</Text>
    </View>
  );
}
