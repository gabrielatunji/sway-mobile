import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="live" options={{ presentation: "card" }} />
        <Stack.Screen name="search" options={{ presentation: "card" }} />
        <Stack.Screen name="music" options={{ presentation: "card" }} />
        <Stack.Screen name="post" options={{ presentation: "card" }} />
        <Stack.Screen name="user" options={{ presentation: "card" }} />
        <Stack.Screen name="(modals)/comments" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/share" options={{ presentation: "modal" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
