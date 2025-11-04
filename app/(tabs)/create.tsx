import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function CreateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Create</Text>
      <Text style={styles.description}>
        Choose a creation path to jump into editing tools and start preparing a new post.
      </Text>

      <View style={styles.buttonGrid}>
        <Pressable style={styles.primaryButton} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.primaryButtonText}>Record a Video</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push("/music" as Href)}>
          <Text style={styles.secondaryButtonText}>Pick a Sound</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push("/(tabs)/home" as Href)}>
          <Text style={styles.secondaryButtonText}>Return to Feed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 24 },
  heading: { color: "#fff", fontSize: 28, fontWeight: "800" },
  description: { color: "#aaa", fontSize: 16, lineHeight: 22 },
  buttonGrid: { gap: 16 },
  primaryButton: { backgroundColor: "#ff0050", borderRadius: 14, paddingVertical: 18, paddingHorizontal: 20 },
  primaryButtonText: { color: "#fff", fontSize: 18, fontWeight: "800", textAlign: "center" },
  secondaryButton: { backgroundColor: "#1f1f1f", borderRadius: 14, paddingVertical: 16 },
  secondaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", textAlign: "center" },
});
