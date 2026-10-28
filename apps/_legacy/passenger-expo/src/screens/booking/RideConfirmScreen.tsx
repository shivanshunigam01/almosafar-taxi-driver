import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import type { PaymentMethod } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FareBreakdownCard } from "../../components/FareBreakdownCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useFareEstimate } from "../../hooks/useFareEstimate";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { selectBooking, setActiveRideId, setPaymentMethodId } from "../../store/bookingSlice";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList, "RideConfirm">;

export default function RideConfirmScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { passenger } = useAuth();
  const { service } = useDataService();
  const { pickup, dropoff, category, paymentMethodId } = useSelector(selectBooking);
  const { breakdown, loading, error } = useFareEstimate(pickup, dropoff, category);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!passenger) return;
    service.getPaymentMethods(passenger.id).then(setMethods);
  }, [passenger, service]);

  useEffect(() => {
    if (!paymentMethodId && methods.length) {
      const def = methods.find((m) => m.isDefault) ?? methods[0];
      dispatch(setPaymentMethodId(def.id));
    }
  }, [methods, paymentMethodId, dispatch]);

  const confirm = async () => {
    if (!passenger || !pickup || !dropoff || !breakdown) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const zone = await Promise.resolve(service.getDefaultZone());
      const created = await service.createRideFromBooking({
        passengerId: passenger.id,
        zoneId: zone.id,
        category,
        pickup,
        dropoff,
        paymentMethodId: paymentMethodId ?? undefined,
      });
      dispatch(setActiveRideId(created.id));
      navigation.replace("SearchingDriver", { rideId: created.id });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not request ride");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title="Confirm ride" />
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-gray-700`}>{pickup?.label}</Text>
        <Text style={tw`text-gray-700 mt-1`}>→ {dropoff?.label}</Text>
        <Text style={tw`capitalize text-sm text-teal-800 mt-2`}>Category: {category}</Text>

        {loading ? <Text style={tw`mt-4`}>Updating estimate…</Text> : null}
        {error ? <Text style={tw`text-red-600 mt-4`}>{error}</Text> : null}
        {breakdown ? (
          <View style={tw`mt-4`}>
            <FareBreakdownCard breakdown={breakdown} isEstimate />
          </View>
        ) : null}

        <Text style={tw`font-semibold mt-6 mb-2`}>Mock payment method</Text>
        {methods.map((m) => (
          <View key={m.id} style={tw`mb-2`}>
            <PrimaryButton
              label={`${m.label}${m.mockLastFour ? ` · ${m.mockLastFour}` : ""}`}
              variant={paymentMethodId === m.id ? "primary" : "secondary"}
              onPress={() => dispatch(setPaymentMethodId(m.id))}
            />
          </View>
        ))}

        {submitError ? <Text style={tw`text-red-600 mt-3`}>{submitError}</Text> : null}
        <View style={tw`mt-6 mb-8`}>
          <PrimaryButton
            label="Confirm & find driver"
            loading={submitting}
            disabled={!breakdown || !paymentMethodId}
            onPress={confirm}
          />
        </View>
      </ScrollView>
    </View>
  );
}
