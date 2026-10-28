import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDataService } from "../context/DataServiceContext";

export function SyncModeNotice() {
  const { service } = useDataService();
  const isLocal = service.mode === "local";

  return (
    <View
      style={tw`${isLocal ? "bg-amber-100 border-amber-400" : "bg-emerald-50 border-emerald-400"} border px-3 py-2 rounded-lg mx-4 my-2`}
    >
      <Text style={tw`text-xs font-semibold ${isLocal ? "text-amber-900" : "text-emerald-900"}`}>
        {isLocal ? "Local demo mode" : "Cloud sync"}
      </Text>
      <Text style={tw`text-xs mt-1 ${isLocal ? "text-amber-800" : "text-emerald-800"}`}>
        {service.syncLabel}
      </Text>
    </View>
  );
}
