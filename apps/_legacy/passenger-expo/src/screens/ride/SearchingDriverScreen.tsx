import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { useDataService } from "../../context/DataServiceContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "SearchingDriver">;
type Nav = StackNavigationProp<RootStackParamList, "SearchingDriver">;

export default function SearchingDriverScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { service } = useDataService();
  const { ride } = useRideSubscription(params.rideId);
  const { t } = useLocale();

  useEffect(() => {
    if (service.mode === "local" && service.startLocalDriverSimulation) {
      service.startLocalDriverSimulation(params.rideId);
      return () => service.stopLocalDriverSimulation?.(params.rideId);
    }
  }, [params.rideId, service]);

  useEffect(() => {
    if (!ride) return;
    if (ride.status === "accepted" || ride.status === "driver_arriving" || ride.status === "in_progress") {
      navigation.replace("ActiveRide", { rideId: ride.id });
    }
    if (ride.status === "rejected" || ride.status === "cancelled") {
      navigation.replace("MainTabs");
    }
  }, [ride, navigation]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("findingDriver")} showBack={false} />
      <SyncModeNotice />
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={tw`text-lg font-semibold mt-4 text-gray-900`}>{t("searchingDriver")}</Text>
        <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
          {service.mode === "local" ? t("localSim") : t("cloudWait")}
        </Text>
      </View>
    </View>
  );
}
