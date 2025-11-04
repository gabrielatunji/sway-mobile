import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

const MOCK_COMMENTS = [
  { id: "1", author: "tyems", message: "This is wild 😂" },
  { id: "2", author: "deejae", message: "Need part 2 immediately" },
  { id: "3", author: "storm", message: "Tag me when it drops" },
];

export default function CommentsModal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <FlatList
        data={MOCK_COMMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Text style={styles.commentAuthor}>@{item.author}</Text>
            <Text style={styles.commentMessage}>{item.message}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Pressable style={styles.cta} onPress={() => router.push("/post" as Href)}>
        <Text style={styles.ctaText}>Reply with video</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  closeText: { color: "#ff0050", fontWeight: "700" },
  listContent: { paddingVertical: 16, gap: 18 },
  commentRow: { gap: 6 },
  commentAuthor: { color: "#fff", fontWeight: "700" },
  commentMessage: { color: "#bbb" },
  cta: { backgroundColor: "#1f6feb", paddingVertical: 14, borderRadius: 12, marginBottom: 24 },
  ctaText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
