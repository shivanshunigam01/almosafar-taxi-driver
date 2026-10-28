import { ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FareBreakdownCard } from "../../components/FareBreakdownCard";
import { RouteMapView } from "../../components/RouteMapView";
import { useRideSubscription } from "../../hooks/useRideSubscription";
import type { RootStackParamList } from "../../navigation/types";

type Route = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetailScreen() {
  const { params } = useRoute<Route>();
  const { ride, loading } = useRideSubscription(params.rideId);

  if (loading || !ride) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <ScreenHeader title="Trip details" />
        <Text style={tw`p-4`}>Loading…</Text>
      </View>
    );
  }

  const fare = ride.fareFinal ?? ride.fareEstimate;

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScreenHeader title="Trip details" />
      <View style={tw`h-48`}>
        <RouteMapView pickup={ride.pickup} dropoff={ride.dropoff} />
      </View>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`capitalize font-bold text-lg`}>{ride.status.replace(/_/g, " ")}</Text>
        <Text style={tw`text-sm text-gray-600 mt-2`}>{ride.requestedAt}</Text>
        <Text style={tw`mt-3`}>{ride.pickup.label}</Text>
        <Text style={tw`mt-1`}>→ {ride.dropoff.label}</Text>
        {ride.cancellationReason ? (
          <Text style={tw`text-red-700 mt-3`}>Cancelled: {ride.cancellationReason}</Text>
        ) : null}
        {fare ? (
          <View style={tw`mt-4`}>
            <FareBreakdownCard
              breakdown={fare}
              isEstimate={!ride.fareFinal && ride.status !== "completed"}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
