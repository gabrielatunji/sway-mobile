import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function MusicScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Sounds</Text>
      <Text style={styles.subtitle}>Preview tracks and attach them to your next post.</Text>

      <View style={styles.track}>
        <View style={styles.artwork} />
        <View style={styles.trackDetails}>
          <Text style={styles.trackTitle}>BODY (danz)</Text>
          <Text style={styles.trackArtist}>Charrrly.k</Text>
        </View>
        <Pressable style={styles.trackAction} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.trackActionText}>Use</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.push("/(tabs)/home" as Href)}>
        <Text style={styles.backButtonText}>Back to Feed</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 20 },
  heading: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#aaa" },
  track: { flexDirection: "row", alignItems: "center", backgroundColor: "#141414", borderRadius: 16,
    padding: 16, gap: 16 },
  artwork: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#333" },
  trackDetails: { flex: 1, gap: 4 },
  trackTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  trackArtist: { color: "#bbb" },
  trackAction: { backgroundColor: "#1f6feb", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  trackActionText: { color: "#fff", fontWeight: "700" },
  backButton: { backgroundColor: "#1f1f1f", paddingVertical: 14, borderRadius: 12 },
  backButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
