import MapView, { Marker, Polyline } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import type { Address } from "@almosafar/shared";

export function RouteMapView({
  pickup,
  dropoff,
  driverLocation,
  focusPickup,
}: {
  pickup: Address;
  dropoff: Address;
  driverLocation?: { latitude: number; longitude: number };
  focusPickup?: boolean;
}) {
  const focus = focusPickup ? pickup.geo : dropoff.geo;
  const other = focusPickup ? dropoff.geo : pickup.geo;
  const midLat = (focus.latitude + other.latitude) / 2;
  const midLng = (focus.longitude + other.longitude) / 2;
  const latDelta = Math.max(0.04, Math.abs(focus.latitude - other.latitude) * 1.4);
  const lngDelta = Math.max(0.04, Math.abs(focus.longitude - other.longitude) * 1.4);

  return (
    <MapView
      style={tw`flex-1 min-h-48 rounded-xl overflow-hidden`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      }}
      accessibilityLabel="Route map"
    >
      <Marker coordinate={pickup.geo} title="Pickup" description={pickup.label} pinColor="green" />
      <Marker coordinate={dropoff.geo} title="Drop-off" description={dropoff.label} pinColor="red" />
      {driverLocation ? (
        <Marker coordinate={driverLocation} title="Driver" pinColor="#f59e0b" />
      ) : null}
      <Polyline coordinates={[pickup.geo, dropoff.geo]} strokeColor="#f59e0b" strokeWidth={4} />
    </MapView>
  );
}
