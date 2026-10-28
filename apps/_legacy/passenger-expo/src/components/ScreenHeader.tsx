import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { useLocale } from "../context/LocaleContext";

export function ScreenHeader({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
}) {
  const navigation = useNavigation();
  const { t } = useLocale();

  return (
    <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200 bg-white`}>
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={tw`pr-3 py-1`}
        >
          <Text style={tw`text-teal-700 text-base font-semibold`}>{t("back")}</Text>
        </Pressable>
      ) : (
        <View style={tw`w-12`} />
      )}
      <Text style={tw`text-lg font-bold text-gray-900 flex-1`} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}
