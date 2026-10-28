import { Pressable, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { useLocale, type AppLocale } from "../../context/LocaleContext";

export default function SettingsScreen() {
  const { t, locale, setLocale } = useLocale();

  const pick = (next: AppLocale, label: string) => (
    <Pressable
      onPress={() => setLocale(next)}
      style={[
        tw`py-3 px-4 rounded-xl mb-2`,
        locale === next ? tw`bg-amber-100 border border-amber-400` : tw`bg-slate-100`,
      ]}
    >
      <Text style={tw`font-semibold text-slate-900`}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("settings")} />
      <View style={tw`p-5`}>
        <Text style={tw`text-sm font-semibold text-slate-600 mb-2`}>{t("language")}</Text>
        {pick("en", t("english"))}
        {pick("ar", t("arabic"))}
        <SyncModeNotice />
      </View>
    </View>
  );
}
