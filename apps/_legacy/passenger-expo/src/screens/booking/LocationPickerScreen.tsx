import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { DEMO_LOCATIONS, DEMO_LOCATIONS_AR } from "@almosafar/shared/demo";
import type { Address } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { setDropoff, setPickup } from "../../store/bookingSlice";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "LocationPicker">;
type Nav = StackNavigationProp<RootStackParamList, "LocationPicker">;

function displayLabel(label: string, locale: "en" | "ar"): string {
  if (locale === "ar") return DEMO_LOCATIONS_AR[label] ?? label;
  return label;
}

export default function LocationPickerScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { locale, t } = useLocale();
  const [query, setQuery] = useState("");

  const locations = DEMO_LOCATIONS.filter((loc) => {
    const label = displayLabel(loc.label, locale);
    return label.toLowerCase().includes(query.toLowerCase());
  });

  const select = (address: Address) => {
    if (params.field === "pickup") dispatch(setPickup(address));
    else dispatch(setDropoff(address));
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader
        title={
          params.field === "pickup" ? t("choosePickup") : t("chooseDestination")
        }
      />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t("searchLocations")}
        style={tw`mx-4 mt-3 border border-gray-300 rounded-lg px-3 py-3`}
        accessibilityLabel={t("searchLocations")}
      />
      <FlatList
        data={locations}
        keyExtractor={(item) => item.label}
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-8`}>{t("searchLocations")}</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`px-4 py-4 border-b border-gray-100`}
            onPress={() => select(item)}
            accessibilityRole="button"
          >
            <Text style={tw`text-base text-gray-900`}>
              {displayLabel(item.label, locale)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
