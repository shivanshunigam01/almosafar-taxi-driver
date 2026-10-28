import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { RideClaimError } from "@almosafar/shared";
import { PrimaryButton } from "../../components/PrimaryButton";
import { RideSummaryCard } from "../../components/RideSummaryCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";

const COUNTDOWN_SEC = 30;

type Route = RouteProp<RootStackParamList, "IncomingRide">;
type Nav = StackNavigationProp<RootStackParamList, "IncomingRide">;

export default function IncomingRideScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { driver } = useAuth();
  const { service } = useDataService();
  const { t } = useLocale();
  const { ride, loading } = useRideSubscription(params.rideId);
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC);
  const [busy, setBusy] = useState(false);
  const [passengerName, setPassengerName] = useState<string | undefined>();

  useEffect(() => {
    if (!ride?.passengerId) return;
    service.getPassenger(ride.passengerId).then((p) => {
      if (p) setPassengerName(p.displayName);
    });
  }, [ride?.passengerId, service]);

  useEffect(() => {
    if (!ride || ride.status !== "requested") return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [ride?.id, ride?.status]);

  useEffect(() => {
    if (seconds === 0 && ride?.status === "requested" && !busy) {
      void onReject(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  useEffect(() => {
    if (ride?.status === "cancelled") {
      Alert.alert(t("cancelledRide"), t("cancelledRideHint"), [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
    if (ride && ride.driverId && ride.driverId !== driver?.id) {
      Alert.alert(t("claimFailed"), undefined, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [ride, driver?.id, navigation, t]);

  const onReject = async (silent?: boolean) => {
    if (!driver || !ride || busy) return;
    setBusy(true);
    try {
      await service.rejectRideAsDriver({ rideId: ride.id, driverId: driver.id });
      if (!silent) navigation.goBack();
      else navigation.goBack();
    } catch {
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const onAccept = async () => {
    if (!driver?.vehicleId || !ride || busy) return;
    setBusy(true);
    try {
      const updated = await service.acceptRideAsDriver({
        rideId: ride.id,
        driverId: driver.id,
        vehicleId: driver.vehicleId,
      });
      navigation.replace("ActiveTrip", { rideId: updated.id });
    } catch (e) {
      const msg = e instanceof RideClaimError ? e.message : t("claimFailed");
      Alert.alert(t("claimFailed"), msg);
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  if (loading || !ride) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <Text style={tw`text-slate-600`}>…</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("incomingRequest")} />
      <View style={tw`p-5`}>
        <View style={tw`bg-amber-100 rounded-xl px-4 py-3 mb-4`}>
          <Text style={tw`text-amber-900 font-bold text-center text-lg`}>{seconds}</Text>
          <Text style={tw`text-amber-800 text-center text-sm`}>{t("secondsLeft")}</Text>
        </View>
        <RideSummaryCard ride={ride} passengerName={passengerName} />
        <View style={tw`mt-6`}>
          <PrimaryButton label={t("accept")} onPress={onAccept} loading={busy} />
        </View>
        <View style={tw`mt-3`}>
          <PrimaryButton
            label={t("reject")}
            variant="secondary"
            onPress={() => onReject()}
            loading={busy}
          />
        </View>
      </View>
    </View>
  );
}
