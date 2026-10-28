import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState("demo.driver.khalid@example.com");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigation.replace("MainTabs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={tw`p-6 pt-16`} keyboardShouldPersistTaps="handled">
        <Text style={tw`text-2xl font-bold text-slate-900`}>{t("demoLogin")}</Text>
        <Text style={tw`text-sm text-slate-600 mt-2`}>{t("demoLoginHint")}</Text>

        <Text style={tw`mt-6 text-sm font-semibold text-slate-700`}>{t("email")}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={tw`border border-slate-300 rounded-xl px-3 py-3 mt-1 text-base`}
          accessibilityLabel={t("email")}
        />

        <Text style={tw`mt-4 text-sm font-semibold text-slate-700`}>{t("password")}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={tw`border border-slate-300 rounded-xl px-3 py-3 mt-1 text-base`}
          accessibilityLabel={t("password")}
        />

        {error ? <Text style={tw`text-red-600 mt-3`}>{error}</Text> : null}

        <View style={tw`mt-6`}>
          <PrimaryButton label={t("signIn")} onPress={onLogin} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
