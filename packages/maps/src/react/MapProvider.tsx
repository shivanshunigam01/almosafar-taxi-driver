"use client";

import React, { createContext, useContext, useMemo } from "react";
import { resolveMapConfig } from "../config";
import type { MapProviderConfig } from "../types";
import { GeocodingService } from "../services/geocoding-service";
import { GeolocationService } from "../services/geolocation-service";
import { NavigationLinkService } from "../services/navigation-link-service";
import { RoutingService } from "../services/routing-service";

type MapServices = {
  config: MapProviderConfig;
  geolocation: GeolocationService;
  geocoding: GeocodingService;
  routing: RoutingService;
  navigation: NavigationLinkService;
};

const MapContext = createContext<MapServices | null>(null);

export function MapProvider({
  children,
  config: configOverride,
}: {
  children: React.ReactNode;
  config?: Partial<MapProviderConfig>;
}) {
  const value = useMemo(() => {
    const config = resolveMapConfig(configOverride);
    return {
      config,
      geolocation: new GeolocationService(),
      geocoding: new GeocodingService(config),
      routing: new RoutingService(config),
      navigation: new NavigationLinkService(),
    };
  }, [configOverride]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapServices(): MapServices {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("MapProvider required");
  return ctx;
}
