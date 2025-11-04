import { SafeAreaView, StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter, type Href } from "expo-router";

export default function UserScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: "https://placehold.co/128x128" }} />
        <View style={styles.headerText}>
          <Text style={styles.handle}>@charrrly.k</Text>
          <Text style={styles.badge}>Creator</Text>
        </View>
      </View>

      <Text style={styles.bio}>
        Storyteller and music enthusiast. Stay tuned for more behind-the-scenes clips.
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.follow} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.followText}>Follow</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => router.push("/(modals)/share" as Href)}>
          <Text style={styles.secondaryText}>Share profile</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => router.push("/(tabs)/home" as Href)}>
          <Text style={styles.secondaryText}>Back to feed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#222" },
  headerText: { gap: 6 },
  handle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  badge: { color: "#ff0050", fontWeight: "700" },
  bio: { color: "#aaa", lineHeight: 20 },
  actions: { gap: 12 },
  follow: { backgroundColor: "#ff0050", borderRadius: 12, paddingVertical: 14 },
  followText: { color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 16 },
  secondary: { backgroundColor: "#1f1f1f", borderRadius: 12, paddingVertical: 14 },
  secondaryText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
