import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDataService } from "../context/DataServiceContext";
import { useLocale } from "../context/LocaleContext";

export function SyncModeNotice() {
  const { service } = useDataService();
  const { t } = useLocale();

  return (
    <View style={tw`bg-slate-100 rounded-lg px-3 py-2 mt-3`}>
      <Text style={tw`text-xs font-semibold text-slate-600`}>{t("syncMode")}</Text>
      <Text style={tw`text-sm text-slate-800 mt-1`}>{service.syncLabel}</Text>
    </View>
  );
}
