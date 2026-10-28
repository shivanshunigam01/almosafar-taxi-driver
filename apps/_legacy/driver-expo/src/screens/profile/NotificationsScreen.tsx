import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useLocale } from "../../context/LocaleContext";

export default function NotificationsScreen() {
  const { t } = useLocale();

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScreenHeader title={t("notifications")} />
      <View style={tw`p-5`}>
        <Text style={tw`text-sm text-slate-500 mb-4`}>{t("demoNotifications")}</Text>
        <View style={tw`bg-white rounded-xl p-4 mb-3 border border-slate-200`}>
          <Text style={tw`text-slate-800`}>{t("notif1")}</Text>
        </View>
        <View style={tw`bg-white rounded-xl p-4 border border-slate-200`}>
          <Text style={tw`text-slate-800`}>{t("notif2")}</Text>
        </View>
      </View>
    </View>
  );
}
