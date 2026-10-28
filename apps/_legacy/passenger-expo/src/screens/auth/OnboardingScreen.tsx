import { useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

const slides = [
  {
    title: "Book demo rides",
    body: "Choose pickup and destination using demo locations or Google Places when configured.",
  },
  {
    title: "Transparent estimates",
    body: "Fares use the shared Almosafar calculator — shown as estimates until your trip completes.",
  },
  {
    title: "Safe demo payments",
    body: "Payment methods are mock only. No real cards or charges are processed.",
  },
];

type Nav = StackNavigationProp<RootStackParamList, "Onboarding">;

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<Nav>();
  const { completeOnboarding } = useAuth();
  const slide = slides[index];

  const next = async () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
      return;
    }
    await completeOnboarding();
    navigation.replace("Login");
  };

  return (
    <View style={tw`flex-1 bg-white px-6 pt-16 pb-8`}>
      <Text style={tw`text-sm text-teal-700 font-semibold`}>
        Step {index + 1} of {slides.length}
      </Text>
      <Text style={tw`text-3xl font-bold text-gray-900 mt-4`}>{slide.title}</Text>
      <Text style={tw`text-base text-gray-600 mt-4 leading-6`}>{slide.body}</Text>
      <View style={tw`flex-1`} />
      <PrimaryButton label={index === slides.length - 1 ? "Get started" : "Next"} onPress={next} />
      <View style={tw`mt-3`}>
        <PrimaryButton
          label="Skip"
          variant="secondary"
          onPress={async () => {
            await completeOnboarding();
            navigation.replace("Login");
          }}
        />
      </View>
    </View>
  );
}
