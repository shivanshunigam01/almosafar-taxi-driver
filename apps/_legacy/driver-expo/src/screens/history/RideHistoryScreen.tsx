import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList>;

export default function RideHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { driver } = useAuth();
  const { service } = useDataService();
  const { t, moneyLocale } = useLocale();
  const [rides, setRides] = useState<Ride[]>([]);

  const load = useCallback(async () => {
    if (!driver) return;
    const list = await service.listRidesForDriver(driver.id);
    setRides(list);
  }, [driver, service]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={tw`flex-1 bg-slate-50 pt-12`}>
      <Text style={tw`text-2xl font-bold text-slate-900 px-5 mb-4`}>{t("rideHistory")}</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-5 pb-8`}
        ListEmptyComponent={
          <Text style={tw`text-slate-500 text-center mt-8`}>{t("noRides")}</Text>
        }
        renderItem={({ item }) => {
          const fare = item.fareFinal?.total ?? item.fareEstimate?.total;
          const statusLabel =
            item.status === "completed"
              ? t("completed")
              : item.status === "cancelled"
                ? t("cancelled")
                : item.status === "rejected"
                  ? t("rejected")
                  : item.status;
          return (
            <Pressable
              onPress={() => navigation.navigate("RideDetail", { rideId: item.id })}
              style={tw`bg-white rounded-xl p-4 mb-3 border border-slate-200`}
            >
              <Text style={tw`text-xs text-slate-500`}>{statusLabel}</Text>
              <Text style={tw`text-base font-semibold text-slate-900 mt-1`} numberOfLines={1}>
                {item.pickup.label}
              </Text>
              <Text style={tw`text-sm text-slate-600`} numberOfLines={1}>
                → {item.dropoff.label}
              </Text>
              {fare ? (
                <Text style={tw`text-amber-600 font-bold mt-2`}>
                  {formatMoney(fare, moneyLocale)}
                </Text>
              ) : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
