import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000", borderTopColor: "#111" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
      }}
      initialRouteName="home"
    >
      <Tabs.Screen name="home" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
      }} />
      <Tabs.Screen name="friends" options={{
        title: "Friends",
        tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
      }} />
    </Tabs>
  );
}
