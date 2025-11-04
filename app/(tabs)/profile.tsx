import { SafeAreaView, StyleSheet, Text, Pressable, View } from "react-native";
import { useRouter, type Href } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile (Preview)</Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.push("/user" as Href)}>
          <Text style={styles.buttonText}>View Public Profile</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.buttonText}>Open Drafts</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/(tabs)/home" as Href)}>
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
