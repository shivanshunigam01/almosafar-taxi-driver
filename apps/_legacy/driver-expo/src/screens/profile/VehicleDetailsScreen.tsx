import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import type { Vehicle } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";

export default function VehicleDetailsScreen() {
  const { driver } = useAuth();
  const { service } = useDataService();
  const { t } = useLocale();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!driver?.vehicleId) return;
    service.getVehicle(driver.vehicleId).then(setVehicle);
  }, [driver?.vehicleId, service]);

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("vehicle")} />
      <View style={tw`p-5`}>
        {vehicle ? (
          <View style={tw`bg-white rounded-2xl p-5 border border-slate-200`}>
            <Text style={tw`text-2xl font-bold text-slate-900`}>
              {vehicle.make} {vehicle.model}
            </Text>
            <Text style={tw`text-slate-600 mt-1`}>{vehicle.color}</Text>
            <View style={tw`mt-4`}>
              <Text style={tw`text-xs text-slate-500 uppercase`}>{t("plate")}</Text>
              <Text style={tw`text-lg font-semibold`}>{vehicle.plateNumber}</Text>
            </View>
            <View style={tw`mt-3`}>
              <Text style={tw`text-xs text-slate-500 uppercase`}>{t("category")}</Text>
              <Text style={tw`text-base capitalize`}>{vehicle.category}</Text>
            </View>
          </View>
        ) : (
          <Text style={tw`text-slate-500`}>—</Text>
        )}
      </View>
    </View>
  );
}
