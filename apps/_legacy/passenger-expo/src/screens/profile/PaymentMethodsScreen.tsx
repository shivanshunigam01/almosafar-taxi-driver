import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import type { PaymentMethod } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";

export default function PaymentMethodsScreen() {
  const { passenger } = useAuth();
  const { service } = useDataService();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (!passenger) return;
    service.getPaymentMethods(passenger.id).then(setMethods);
  }, [passenger, service]);

  const setDefault = async (id: string) => {
    if (!passenger) return;
    await service.setDefaultPaymentMethod(passenger.id, id);
    const next = await service.getPaymentMethods(passenger.id);
    setMethods(next);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title="Payment methods" />
      <Text style={tw`px-4 py-2 text-sm text-amber-800 bg-amber-50`}>
        Mock payment methods only — no real cards or charges.
      </Text>
      <View style={tw`p-4`}>
        {methods.map((m) => (
          <View key={m.id} style={tw`mb-3`}>
            <PrimaryButton
              label={`${m.label}${m.isDefault ? " (default)" : ""}`}
              variant={m.isDefault ? "primary" : "secondary"}
              onPress={() => setDefault(m.id)}
            />
          </View>
        ))}
        {methods.length === 0 ? (
          <Text style={tw`text-gray-500`}>No mock payment methods found.</Text>
        ) : null}
      </View>
    </View>
  );
}
