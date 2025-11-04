import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function InboxScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Inbox</Text>
      <Text style={styles.subheading}>See notifications and respond to interactions.</Text>

      <View style={styles.notification}>
        <View style={styles.dot} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>New follower</Text>
          <Text style={styles.notificationBody}>Alex just followed you moments ago.</Text>
        </View>
        <Pressable style={styles.notificationAction} onPress={() => router.push("/user" as Href)}>
          <Text style={styles.notificationActionText}>View</Text>
        </Pressable>
      </View>

      <Pressable style={styles.fullWidthButton} onPress={() => router.push("/(tabs)/home" as Href)}>
        <Text style={styles.fullWidthButtonText}>Back to feed</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 20 },
  heading: { color: "#fff", fontSize: 26, fontWeight: "800" },
  subheading: { color: "#aaa" },
  notification: { flexDirection: "row", alignItems: "center", backgroundColor: "#141414", padding: 16,
    borderRadius: 16, gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff0050" },
  notificationContent: { flex: 1, gap: 4 },
  notificationTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  notificationBody: { color: "#bbb" },
  notificationAction: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#2a2a2a" },
  notificationActionText: { color: "#fff", fontWeight: "700" },
  fullWidthButton: { marginTop: 12, backgroundColor: "#1f1f1f", paddingVertical: 14, borderRadius: 12 },
  fullWidthButtonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
