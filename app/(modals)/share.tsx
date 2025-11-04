import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useRouter, type Href } from "expo-router";

export default function ShareModal() {
  const router = useRouter();

  const shareOptions: Array<{ label: string; route: Href }> = [
    { label: "Copy link", route: "/post" as Href },
    { label: "Share to inbox", route: "/(tabs)/inbox" as Href },
    { label: "Open profile", route: "/user" as Href },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Share</Text>
      <View style={styles.options}>
        {shareOptions.map((option) => (
          <Pressable key={option.label} style={styles.optionButton} onPress={() => router.push(option.route)}>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, gap: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "800" },
  options: { gap: 12 },
  optionButton: { backgroundColor: "#1f1f1f", borderRadius: 12, paddingVertical: 16 },
  optionLabel: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
  closeButton: { backgroundColor: "#ff0050", borderRadius: 12, paddingVertical: 14 },
  closeButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
