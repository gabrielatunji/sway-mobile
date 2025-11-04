import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

export default function FriendsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Friends</Text>
      <Text style={styles.subheading}>Connect with people and explore new creators.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Invite Contacts</Text>
        <Pressable style={styles.cardButton} onPress={() => router.push("/post" as Href)}>
          <Text style={styles.cardButtonText}>Send Invite</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Discover via Search</Text>
        <Pressable style={styles.cardButton} onPress={() => router.push("/search" as Href)}>
          <Text style={styles.cardButtonText}>Open Search</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Back to Feed</Text>
        <Pressable style={styles.cardButton} onPress={() => router.push("/(tabs)/home" as Href)}>
          <Text style={styles.cardButtonText}>Go Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 18 },
  heading: { color: "#fff", fontSize: 24, fontWeight: "800" },
  subheading: { color: "#aaa", fontSize: 16 },
  card: { backgroundColor: "#141414", borderRadius: 16, padding: 18, gap: 12 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cardButton: { backgroundColor: "#1f6feb", borderRadius: 10, paddingVertical: 12 },
  cardButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
