import { useCallback, useEffect, useRef } from "react";
import { Switch, Text, View } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";
import { useDriverActiveRide } from "../../hooks/useDriverActiveRide";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList>;

export default function DriverHomeScreen() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { driver, isOnline, setOnline } = useAuth();
  const { service } = useDataService();
  const { t } = useLocale();
  const { activeRide, refresh } = useDriverActiveRide();
  const pendingNavRef = useRef<string | null>(null);

  const onToggleOnline = async (value: boolean) => {
    await setOnline(value);
    refresh();
  };

  const tryShowIncoming = useCallback(
    (rideId: string) => {
      if (activeRide) return;
      if (pendingNavRef.current === rideId) return;
      pendingNavRef.current = rideId;
      navigation.navigate("IncomingRide", { rideId });
    },
    [activeRide, navigation]
  );

  useEffect(() => {
    if (!isFocused || !isOnline || !driver) return;
    const unsub = service.subscribeOpenRideRequests((rides) => {
      const open = rides.find((r) => r.status === "requested" && !r.driverId);
      if (open) tryShowIncoming(open.id);
    });
    return unsub;
  }, [isFocused, isOnline, driver, service, tryShowIncoming]);

  useEffect(() => {
    if (activeRide && isFocused) {
      pendingNavRef.current = null;
    }
  }, [activeRide, isFocused]);

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <View style={tw`bg-slate-900 px-5 pt-12 pb-6`}>
        <Text style={tw`text-amber-400 text-sm font-semibold`}>{t("driverAppTitle")}</Text>
        <Text style={tw`text-white text-2xl font-bold mt-1`}>{driver?.displayName ?? "—"}</Text>
        <View style={tw`flex-row items-center justify-between mt-5 bg-slate-800 rounded-xl px-4 py-3`}>
          <View style={tw`flex-1 pr-3`}>
            <Text style={tw`text-white font-bold text-lg`}>
              {isOnline ? t("online") : t("offline")}
            </Text>
            <Text style={tw`text-slate-300 text-xs mt-1`}>
              {isOnline ? t("onlineHint") : t("offlineHint")}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={onToggleOnline}
            trackColor={{ false: "#64748b", true: "#f59e0b" }}
            accessibilityLabel={isOnline ? t("goOffline") : t("goOnline")}
          />
        </View>
      </View>

      <View style={tw`p-5`}>
        <SyncModeNotice />

        {activeRide ? (
          <View style={tw`mt-5`}>
            <Text style={tw`text-slate-700 font-semibold mb-2`}>{t("activeTrip")}</Text>
            <PrimaryButton
              label={t("continueTrip")}
              onPress={() =>
                navigation.navigate("ActiveTrip", { rideId: activeRide.id })
              }
            />
          </View>
        ) : isOnline ? (
          <Text style={tw`text-slate-600 mt-6 text-center`}>{t("noOpenRequests")}</Text>
        ) : (
          <View style={tw`mt-5`}>
            <PrimaryButton label={t("goOnline")} onPress={() => onToggleOnline(true)} />
          </View>
        )}

        {driver ? (
          <View style={tw`mt-8 bg-white rounded-2xl p-4 border border-slate-200`}>
            <Text style={tw`text-xs text-slate-500`}>{t("rating")}</Text>
            <Text style={tw`text-lg font-bold text-slate-900`}>
              {driver.ratingAverage?.toFixed(2) ?? "—"} ★
            </Text>
            <Text style={tw`text-xs text-slate-500 mt-3`}>{t("license")}</Text>
            <Text style={tw`text-base text-slate-800`}>{driver.licenseNumber}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
