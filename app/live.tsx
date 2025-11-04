import { SafeAreaView, StyleSheet, Text, Pressable, View } from "react-native";
import { useRouter, type Href } from "expo-router";

export default function LiveScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Live Experiences</Text>
      <Text style={styles.subtitle}>Live rooms will appear here once we connect to your camera.</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.primaryText}>Schedule a Live</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => router.push("/(tabs)/home" as Href)}>
          <Text style={styles.secondaryText}>Return Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#aaa", lineHeight: 22 },
  actions: { gap: 16 },
  primary: { backgroundColor: "#ff0050", paddingVertical: 16, borderRadius: 14 },
  primaryText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "700" },
  secondary: { backgroundColor: "#1f1f1f", paddingVertical: 14, borderRadius: 14 },
  secondaryText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
