import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { resolveDemoMode } from "@almosafar/shared";
import { DemoBanner } from "./src/components/DemoBanner";
import { LocaleProvider } from "./src/context/LocaleContext";
import { DataServiceProvider } from "./src/context/DataServiceContext";
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/navigationRef";

export default function App() {
  const demoMode = resolveDemoMode({
    EXPO_PUBLIC_ALMOSAFAR_DEMO_MODE: process.env.EXPO_PUBLIC_ALMOSAFAR_DEMO_MODE,
    ALMOSAFAR_DEMO_MODE: process.env.ALMOSAFAR_DEMO_MODE,
    NODE_ENV: process.env.NODE_ENV,
  });

  return (
    <LocaleProvider>
      <DataServiceProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <SafeAreaProvider>
              <View style={tw`flex-1 bg-white`}>
                {demoMode ? <DemoBanner /> : null}
                <RootNavigator />
              </View>
              <StatusBar style="light" />
            </SafeAreaProvider>
          </NavigationContainer>
        </AuthProvider>
      </DataServiceProvider>
    </LocaleProvider>
  );
}
