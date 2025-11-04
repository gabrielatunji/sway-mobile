import { StyleSheet, Text, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const handleDrafts = () => console.log("[profile] drafts coming soon");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile (Preview)</Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.push("/user" as Href)}>
          <Text style={styles.buttonText}>View Public Profile</Text>
        </Pressable>
  <Pressable style={styles.button} onPress={handleDrafts}>
          <Text style={styles.buttonText}>Open Drafts</Text>
        </Pressable>
  <Pressable style={styles.button} onPress={() => router.push("/home" as Href)}>
          <Text style={styles.buttonText}>Back to Feed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 24 },
  heading: { color: "#fff", fontSize: 24, fontWeight: "800" },
  buttons: { gap: 12 },
  button: { backgroundColor: "#1f1f1f", paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
