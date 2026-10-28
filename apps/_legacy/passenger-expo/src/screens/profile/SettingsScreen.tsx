import { Switch, Text, View } from "react-native";
import { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { resolveDemoMode } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SyncModeNotice } from "../../components/SyncModeNotice";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useLocale } from "../../context/LocaleContext";

export default function SettingsScreen() {
  const { t, locale, setLocale } = useLocale();
  const demoMode = resolveDemoMode({
    EXPO_PUBLIC_ALMOSAFAR_DEMO_MODE: process.env.EXPO_PUBLIC_ALMOSAFAR_DEMO_MODE,
    NODE_ENV: process.env.NODE_ENV,
  });
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title={t("settings")} />
      <SyncModeNotice />
      <View style={tw`p-4`}>
        <Text style={tw`font-semibold mb-2`}>{t("language")}</Text>
        <PrimaryButton
          label={t("english")}
          variant={locale === "en" ? "primary" : "secondary"}
          onPress={() => setLocale("en")}
        />
        <View style={tw`mt-2`}>
          <PrimaryButton
            label={t("arabic")}
            variant={locale === "ar" ? "primary" : "secondary"}
            onPress={() => setLocale("ar")}
          />
        </View>
        <Text style={tw`text-xs text-gray-500 mt-2`}>
          Arabic enables RTL layout (restart app if layout does not flip).
        </Text>

        <View style={tw`flex-row justify-between items-center py-3 border-b border-gray-200 mt-4`}>
          <Text style={tw`text-base`}>Demo notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            accessibilityLabel="Toggle demo notifications"
          />
        </View>
        <Text style={tw`text-sm text-gray-600 mt-4`}>
          Demo mode banner: {demoMode ? "On" : "Off"} (environment variables).
        </Text>
      </View>
    </View>
  );
}
