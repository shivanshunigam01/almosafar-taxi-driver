import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import {
  PASSENGER_CANCELLATION_POLICY,
  canPassengerCancelRide,
  formatMoney,
  type RideStatus,
} from "@almosafar/shared";
import type { Driver, Vehicle } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { RouteMapView } from "../../components/RouteMapView";
import { PrimaryButton } from "../../components/PrimaryButton";
import { FareBreakdownCard } from "../../components/FareBreakdownCard";
import { useDataService } from "../../context/DataServiceContext";
import { useAuth } from "../../context/AuthContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

const STATUS_LABELS: Record<RideStatus, { en: string; ar: string }> = {
  requested: { en: "Requested", ar: "مطلوبة" },
  accepted: { en: "Driver assigned", ar: "تم تعيين السائق" },
  driver_arriving: { en: "Driver arriving", ar: "السائق في الطريق" },
  in_progress: { en: "Trip in progress", ar: "الرحلة جارية" },
  completed: { en: "Completed", ar: "مكتملة" },
  rejected: { en: "Rejected", ar: "مرفوضة" },
  cancelled: { en: "Cancelled", ar: "ملغاة" },
};

type Route = RouteProp<RootStackParamList, "ActiveRide">;
type Nav = StackNavigationProp<RootStackParamList, "ActiveRide">;

export default function ActiveRideScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { service } = useDataService();
  const { passenger } = useAuth();
  const { ride, loading } = useRideSubscription(params.rideId);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const { locale, t } = useLocale();

  useEffect(() => {
    if (!ride?.driverId) return;
    service.getDriver(ride.driverId).then(setDriver);
    if (ride.vehicleId) service.getVehicle(ride.vehicleId).then(setVehicle);
  }, [ride?.driverId, ride?.vehicleId, service]);

  useEffect(() => {
    if (ride?.status === "completed") {
      navigation.replace("TripCompleted", { rideId: ride.id });
    }
  }, [ride?.status, ride?.id, navigation]);

  const cancelRide = () => {
    if (!ride) return;
    const policy = canPassengerCancelRide(ride.status);
    if (!policy.allowed) return;
    navigation.navigate("CancelRide", { rideId: ride.id });
  };

  if (loading || !ride) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <Text>Loading trip…</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("yourTrip")} showBack={false} />
      <View style={tw`h-52`}>
        <RouteMapView
          pickup={ride.pickup}
          dropoff={ride.dropoff}
          driverLocation={ride.driverLiveLocation}
        />
      </View>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-lg font-bold`}>
          {locale === "ar" ? STATUS_LABELS[ride.status].ar : STATUS_LABELS[ride.status].en}
        </Text>
        {driver ? (
          <View style={tw`mt-3 bg-gray-50 p-3 rounded-lg`}>
            <Text style={tw`font-semibold`}>{driver.displayName}</Text>
            {vehicle ? (
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                {vehicle.color} {vehicle.make} {vehicle.model} · {vehicle.plateNumber}
              </Text>
            ) : null}
            {driver.ratingAverage ? (
              <Text style={tw`text-sm text-gray-600 mt-1`}>Rating {driver.ratingAverage}</Text>
            ) : null}
          </View>
        ) : (
          <Text style={tw`text-gray-600 mt-2`}>{t("assigningDriver")}</Text>
        )}

        {ride.fareEstimate ? (
          <View style={tw`mt-4`}>
            <FareBreakdownCard breakdown={ride.fareEstimate} isEstimate={ride.status !== "completed"} />
          </View>
        ) : null}

        <Text style={tw`text-xs text-gray-500 mt-4`}>
          Est. total: {ride.fareEstimate ? formatMoney(ride.fareEstimate.total) : "—"}
        </Text>

        <View style={tw`mt-4`}>
          <PrimaryButton
            label={t("cancelRide")}
            variant="danger"
            onPress={cancelRide}
            disabled={!canPassengerCancelRide(ride.status).allowed}
          />
        </View>
        <Text style={tw`text-xs text-gray-500 mt-3`}>
          {PASSENGER_CANCELLATION_POLICY.rules.join(" ")}
        </Text>
      </ScrollView>
    </View>
  );
}
