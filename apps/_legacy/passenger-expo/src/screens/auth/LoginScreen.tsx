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
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo.passenger.sara@example.com");
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
        <Text style={tw`text-2xl font-bold text-gray-900`}>Demo login</Text>
        <Text style={tw`text-sm text-gray-600 mt-2`}>
          Use any demo email. Password is not validated in demo mode.
        </Text>

        <Text style={tw`mt-6 text-sm font-semibold text-gray-700`}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={tw`border border-gray-300 rounded-lg px-3 py-3 mt-1 text-base`}
          accessibilityLabel="Email address"
        />

        <Text style={tw`mt-4 text-sm font-semibold text-gray-700`}>Password (demo)</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={tw`border border-gray-300 rounded-lg px-3 py-3 mt-1 text-base`}
          accessibilityLabel="Password"
        />

        {error ? <Text style={tw`text-red-600 mt-3`}>{error}</Text> : null}

        <View style={tw`mt-6`}>
          <PrimaryButton label="Sign in" onPress={onLogin} loading={loading} />
        </View>
        <View style={tw`mt-3`}>
          <PrimaryButton
            label="Create demo account"
            variant="secondary"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
