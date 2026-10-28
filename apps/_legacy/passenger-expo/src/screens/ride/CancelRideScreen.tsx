import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PASSENGER_CANCELLATION_REASONS } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "CancelRide">;
type Nav = StackNavigationProp<RootStackParamList, "CancelRide">;

export default function CancelRideScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { passenger } = useAuth();
  const { service } = useDataService();
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (!passenger || !selected) return;
    const reasonObj = PASSENGER_CANCELLATION_REASONS.find((r) => r.id === selected);
    const reason = locale === "ar" ? reasonObj?.ar : reasonObj?.en;
    if (!reason) return;
    setLoading(true);
    setError(null);
    try {
      await service.cancelRideAsPassenger(params.rideId, passenger.id, reason);
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("selectCancelReason")} />
      <ScrollView contentContainerStyle={tw`p-4`}>
        {PASSENGER_CANCELLATION_REASONS.map((r) => (
          <View key={r.id} style={tw`mb-2`}>
            <PrimaryButton
              label={locale === "ar" ? r.ar : r.en}
              variant={selected === r.id ? "primary" : "secondary"}
              onPress={() => setSelected(r.id)}
            />
          </View>
        ))}
        {error ? <Text style={tw`text-red-600 mt-2`}>{error}</Text> : null}
        <View style={tw`mt-4`}>
          <PrimaryButton
            label={t("confirmCancel")}
            variant="danger"
            disabled={!selected}
            loading={loading}
            onPress={confirm}
          />
        </View>
        <View style={tw`mt-3`}>
          <PrimaryButton label={t("keepRide")} variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
}
