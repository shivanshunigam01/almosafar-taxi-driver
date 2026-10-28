import type { ExpoConfig } from "expo/config";

/** EAS project @shivanshunigam/almosafar-taxi-driver */
const easProjectId =
  process.env.EAS_PROJECT_ID_DRIVER ??
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
  "6ecf4787-78a3-466c-bda1-57c7f09f2062";

const config: ExpoConfig = {
  name: "Almosafar Driver (Demo)",
  slug: "almosafar-taxi-driver",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "almosafar-driver",
  userInterfaceStyle: "light",
  plugins: ["expo-splash-screen"],
  ios: {
    bundleIdentifier: "com.almosafar.taxi.driver",
  },
  android: {
    package: "com.almosafar.taxi.driver",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0f172a",
    },
  },
  extra: {
    eas: {
      projectId: easProjectId,
    },
  },
};

export default config;
