import { StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function SearchScreen() {
  const router = useRouter();
  const handleTrendingSounds = () => console.log("[search] trending sounds coming soon");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search creators, sounds, or tags"
        placeholderTextColor="#666"
      />

      <View style={styles.quickLinks}>
  <Pressable style={styles.quickLink} onPress={handleTrendingSounds}>
          <Text style={styles.quickLinkText}>Trending Sounds</Text>
        </Pressable>
        <Pressable style={styles.quickLink} onPress={() => router.push("/user" as Href)}>
          <Text style={styles.quickLinkText}>Top Creators</Text>
        </Pressable>
  <Pressable style={styles.quickLink} onPress={() => router.push("/home" as Href)}>
          <Text style={styles.quickLinkText}>Back to Feed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 18 },
  heading: { color: "#fff", fontSize: 28, fontWeight: "800" },
  input: { backgroundColor: "#121212", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    color: "#fff", fontSize: 16 },
  quickLinks: { gap: 12 },
  quickLink: { backgroundColor: "#1f1f1f", borderRadius: 12, paddingVertical: 16 },
  quickLinkText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
