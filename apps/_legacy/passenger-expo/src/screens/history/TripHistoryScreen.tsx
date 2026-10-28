import { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { formatMoney, type Ride } from "@almosafar/shared";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList>;

export default function TripHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { passenger } = useAuth();
  const { service } = useDataService();
  const [rides, setRides] = useState<Ride[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!passenger) return;
    const list = await service.listRidesForPassenger(passenger.id);
    setRides(list);
  }, [passenger, service]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`px-4 pt-4 pb-2`}>
        <Text style={tw`text-2xl font-bold`}>Trip history</Text>
        <Text style={tw`text-sm text-gray-600`}>Demo trips on this sync mode</Text>
      </View>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }} />
        }
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-12 px-6`}>
            No trips yet. Book a demo ride from Home.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`bg-white mx-4 mb-3 p-4 rounded-lg border border-gray-200`}
            onPress={() =>
              navigation.navigate("TripDetail", { rideId: item.id })
            }
            accessibilityRole="button"
          >
            <Text style={tw`font-semibold capitalize`}>{item.status.replace(/_/g, " ")}</Text>
            <Text style={tw`text-sm text-gray-600 mt-1`} numberOfLines={1}>
              {item.pickup.label} → {item.dropoff.label}
            </Text>
            {item.fareEstimate ? (
              <Text style={tw`text-sm text-teal-800 mt-2`}>
                {formatMoney(item.fareFinal?.total ?? item.fareEstimate.total)}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
