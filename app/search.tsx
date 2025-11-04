import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const FILTERS = ["limitless", "kalshi", "manifold", "polymarket"];

export default function SearchScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top row: back button, search bar, search icon */}
      <View style={styles.topRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="Search Markets"
            placeholderTextColor="#888"
          />
        </View>
        <Pressable style={styles.searchBtn} onPress={() => {}}>
          <Ionicons name="search" size={22} color="#111" />
        </Pressable>
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            style={[styles.filterCard, selected === filter && styles.filterCardSelected]}
            onPress={() => setSelected(selected === filter ? null : filter)}
          >
            <Text style={[styles.filterText, selected === filter && styles.filterTextSelected]}>{filter}</Text>
          </Pressable>
        ))}
      </View>
      {/* ...existing code for search results or other UI... */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 10 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  backBtn: { padding: 4, marginRight: 4, borderRadius: 8 },
  searchBarWrapRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  searchBtn: { padding: 4, borderRadius: 8 },
  searchBarWrap: { marginBottom: 10 },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#222",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  filterRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 7,
  },
  filterCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  filterCardSelected: {
    backgroundColor: "#222",
    borderColor: "#222",
  },
  filterText: {
    color: "#222",
    fontWeight: "700",
    fontSize: 15,
    textTransform: "capitalize",
  },
  filterTextSelected: {
    color: "#fff",
  },
});