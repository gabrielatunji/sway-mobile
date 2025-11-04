import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function PostScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Post Builder</Text>
      <Text style={styles.description}>This is a placeholder for the recording studio and post composer.</Text>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => router.push("/music" as Href)}>
          <Text style={styles.actionButtonText}>Add Sound</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => router.push("/(modals)/share" as Href)}>
          <Text style={styles.actionButtonText}>Share Options</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => router.push("/(tabs)/home" as Href)}>
          <Text style={styles.actionButtonText}>Back to Feed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 24 },
  heading: { color: "#fff", fontSize: 28, fontWeight: "800" },
  description: { color: "#aaa", fontSize: 16, lineHeight: 22 },
  actions: { gap: 14 },
  actionButton: { backgroundColor: "#1f1f1f", paddingVertical: 16, borderRadius: 12 },
  actionButtonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
});
