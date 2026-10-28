import MapView, { Marker, Polyline } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import type { Address } from "@almosafar/shared";

export function RouteMapView({
  pickup,
  dropoff,
  driverLocation,
}: {
  pickup: Address;
  dropoff: Address;
  driverLocation?: { latitude: number; longitude: number };
}) {
  const midLat = (pickup.geo.latitude + dropoff.geo.latitude) / 2;
  const midLng = (pickup.geo.longitude + dropoff.geo.longitude) / 2;
  const latDelta =
    Math.max(0.05, Math.abs(pickup.geo.latitude - dropoff.geo.latitude) * 1.6);
  const lngDelta =
    Math.max(0.05, Math.abs(pickup.geo.longitude - dropoff.geo.longitude) * 1.6);

  return (
    <MapView
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      }}
      accessibilityLabel="Route map preview"
    >
      <Marker
        coordinate={pickup.geo}
        title="Pickup"
        description={pickup.label}
        pinColor="green"
      />
      <Marker
        coordinate={dropoff.geo}
        title="Drop-off"
        description={dropoff.label}
        pinColor="red"
      />
      {driverLocation ? (
        <Marker coordinate={driverLocation} title="Driver" pinColor="blue" />
      ) : null}
      <Polyline
        coordinates={[pickup.geo, dropoff.geo]}
        strokeColor="#0f766e"
        strokeWidth={4}
      />
    </MapView>
  );
}
