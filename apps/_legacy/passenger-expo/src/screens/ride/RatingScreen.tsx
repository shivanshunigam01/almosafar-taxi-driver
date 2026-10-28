import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { createDemoId } from "@almosafar/shared";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";
import { useDispatch } from "react-redux";
import { resetBookingDraft } from "../../store/bookingSlice";

type Route = RouteProp<RootStackParamList, "Rating">;
type Nav = StackNavigationProp<RootStackParamList, "Rating">;

export default function RatingScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { passenger } = useAuth();
  const { service } = useDataService();
  const { ride } = useRideSubscription(params.rideId);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!passenger || !ride?.driverId) return;
    setLoading(true);
    await service.submitRating({
      id: createDemoId(`rating_${Date.now()}`),
      rideId: ride.id,
      fromPassengerId: passenger.id,
      toDriverId: ride.driverId,
      score,
      comment: comment || undefined,
      createdAt: new Date().toISOString(),
      isDemoData: true,
    });
    setLoading(false);
    dispatch(resetBookingDraft());
    navigation.replace("MainTabs");
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title="Rate trip" showBack={false} />
      <View style={tw`p-4`}>
        <Text style={tw`text-gray-700`}>Demo feedback only — stored locally / cloud demo.</Text>
        <View style={tw`flex-row mt-4 justify-between`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setScore(n)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${n} stars`}
              style={tw`px-3 py-2 rounded-lg ${score === n ? "bg-teal-700" : "bg-gray-200"}`}
            >
              <Text style={tw`${score === n ? "text-white" : "text-gray-900"} font-bold`}>
                {n}★
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Optional comment"
          multiline
          style={tw`border border-gray-300 rounded-lg p-3 mt-4 min-h-[100px]`}
        />
        <View style={tw`mt-6`}>
          <PrimaryButton label="Submit feedback" onPress={submit} loading={loading} />
        </View>
      </View>
    </View>
  );
}
