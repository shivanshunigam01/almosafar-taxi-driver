import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { RouteMapView } from "../../components/RouteMapView";
import { RideSummaryCard } from "../../components/RideSummaryCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "ActiveTrip">;
type Nav = StackNavigationProp<RootStackParamList, "ActiveTrip">;

export default function ActiveTripScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { driver } = useAuth();
  const { service } = useDataService();
  const { t } = useLocale();
  const { ride, loading } = useRideSubscription(params.rideId);
  const [busy, setBusy] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [awaitingPin, setAwaitingPin] = useState(false);
  const [passengerName, setPassengerName] = useState<string | undefined>();

  useEffect(() => {
    if (!ride?.passengerId) return;
    service.getPassenger(ride.passengerId).then((p) => {
      if (p) setPassengerName(p.displayName);
    });
  }, [ride?.passengerId, service]);

  useEffect(() => {
    if (ride?.status === "completed") {
      navigation.replace("TripReceipt", { rideId: ride.id });
    }
    if (ride?.status === "cancelled") {
      Alert.alert(t("cancelledRide"), t("cancelledRideHint"), [
        { text: "OK", onPress: () => navigation.navigate("MainTabs") },
      ]);
    }
  }, [ride?.status, ride?.id, navigation, t]);

  const transition = async (toStatus: NonNullable<typeof ride>["status"]) => {
    if (!driver || !ride) return;
    setBusy(true);
    try {
      await service.transitionRideAsDriver({
        rideId: ride.id,
        driverId: driver.id,
        toStatus,
      });
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Transition failed");
    } finally {
      setBusy(false);
    }
  };

  const onVerifyPin = async () => {
    if (!ride?.demoPassengerPin) {
      setPinError("Demo PIN not set");
      return;
    }
    if (pinInput.trim() !== ride.demoPassengerPin) {
      setPinError("Incorrect PIN");
      return;
    }
    setPinError(null);
    await transition("in_progress");
  };

  if (loading || !ride) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <Text style={tw`text-slate-600`}>…</Text>
      </View>
    );
  }

  const focusPickup = ride.status === "accepted" || ride.status === "driver_arriving";
  const mapHeight = ride.status === "in_progress" ? 280 : 220;

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("activeTrip")} />
      <ScrollView contentContainerStyle={tw`p-4 pb-10`}>
        <View style={{ height: mapHeight }}>
          <RouteMapView
            pickup={ride.pickup}
            dropoff={ride.dropoff}
            driverLocation={ride.driverLiveLocation}
            focusPickup={focusPickup}
          />
        </View>
        {ride.status === "in_progress" ? (
          <Text style={tw`text-xs text-slate-500 mt-2 text-center`}>{t("simulatedTracking")}</Text>
        ) : null}

        <View style={tw`mt-4`}>
          <RideSummaryCard ride={ride} passengerName={passengerName} />
        </View>

        {ride.status === "accepted" ? (
          <View style={tw`mt-5`}>
            <Text style={tw`text-slate-700 mb-2 font-semibold`}>{t("toPickup")}</Text>
            <PrimaryButton
              label={t("navigateToPickup")}
              loading={busy}
              onPress={() => transition("driver_arriving")}
            />
          </View>
        ) : null}

        {ride.status === "driver_arriving" && !awaitingPin ? (
          <View style={tw`mt-5`}>
            <PrimaryButton
              label={t("arrivedAtPickup")}
              loading={busy}
              onPress={() => setAwaitingPin(true)}
            />
          </View>
        ) : null}

        {ride.status === "driver_arriving" && awaitingPin ? (
          <View style={tw`mt-5 bg-white rounded-2xl p-4 border border-slate-200`}>
            <Text style={tw`font-bold text-slate-900`}>{t("verifyPin")}</Text>
            <Text style={tw`text-sm text-slate-600 mt-1`}>{t("verifyPinHint")}</Text>
            {ride.isDemoData && ride.demoPassengerPin ? (
              <Text style={tw`text-xs text-amber-700 mt-2`}>
                Demo PIN (share with passenger): {ride.demoPassengerPin}
              </Text>
            ) : null}
            <TextInput
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="number-pad"
              maxLength={4}
              placeholder={t("pinPlaceholder")}
              style={tw`border border-slate-300 rounded-xl px-3 py-3 mt-3 text-lg tracking-widest text-center`}
            />
            {pinError ? <Text style={tw`text-red-600 mt-2`}>{pinError}</Text> : null}
            <View style={tw`mt-4`}>
              <PrimaryButton label={t("startTrip")} loading={busy} onPress={onVerifyPin} />
            </View>
          </View>
        ) : null}

        {ride.status === "in_progress" ? (
          <View style={tw`mt-5`}>
            <Text style={tw`text-center font-semibold text-slate-800 mb-2`}>
              {t("tripInProgress")}
            </Text>
            <PrimaryButton
              label={t("completeTrip")}
              loading={busy}
              onPress={() => transition("completed")}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
