import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";
import { resetToLogin } from "../../navigation/navigationRef";

type Nav = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { passenger, logout } = useAuth();

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-900`}>Profile</Text>
      {passenger ? (
        <View style={tw`bg-white mt-4 p-4 rounded-lg border border-gray-200`}>
          <Text style={tw`text-lg font-semibold`}>{passenger.displayName}</Text>
          <Text style={tw`text-gray-600 mt-1`}>{passenger.email}</Text>
          {passenger.phoneE164 ? (
            <Text style={tw`text-gray-600`}>{passenger.phoneE164}</Text>
          ) : null}
          <Text style={tw`text-xs text-amber-700 mt-2`}>Demo profile — not a real customer.</Text>
        </View>
      ) : null}

      <View style={tw`mt-4`}>
        <PrimaryButton label="Payment methods (mock)" onPress={() => navigation.navigate("PaymentMethods")} />
      </View>
      <View style={tw`mt-3`}>
        <PrimaryButton label="Settings" variant="secondary" onPress={() => navigation.navigate("Settings")} />
      </View>
      <View style={tw`mt-3`}>
        <PrimaryButton
          label="Sign out"
          variant="danger"
          onPress={async () => {
            await logout();
            resetToLogin();
          }}
        />
      </View>
    </View>
  );
}
