import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        tabBarShowLabel: true,
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
      <Tabs.Screen name="wallet" options={{
        title: "Wallet",
        tabBarIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    height: 64,
    paddingBottom: 10,
  },
});
