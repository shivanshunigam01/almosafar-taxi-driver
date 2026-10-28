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
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

type Nav = StackNavigationProp<RootStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("500000099");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      await register(name, email, phone);
      navigation.replace("MainTabs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title="Demo registration" />
      <ScrollView contentContainerStyle={tw`p-6`} keyboardShouldPersistTaps="handled">
        <Text style={tw`text-sm text-gray-600 mb-4`}>
          Creates a fictional demo passenger profile on this device / cloud project.
        </Text>
        <Field label="Display name" value={name} onChangeText={setName} />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Field label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        {error ? <Text style={tw`text-red-600 mt-2`}>{error}</Text> : null}
        <View style={tw`mt-6`}>
          <PrimaryButton label="Register" onPress={onRegister} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={tw`mb-3`}>
      <Text style={tw`text-sm font-semibold text-gray-700`}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        style={tw`border border-gray-300 rounded-lg px-3 py-3 mt-1 text-base`}
        accessibilityLabel={label}
      />
    </View>
  );
}
