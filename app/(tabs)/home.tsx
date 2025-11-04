import { useRouter, type Href } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Video placeholder background */}
      <View style={styles.videoPlaceholder} />

      {/* Top overlay bar */}
      <SafeAreaView style={styles.topBar}>
        {/* LIVE badge */}
        <Pressable onPress={() => router.push("/live" as Href)} style={styles.livePill}>
          <Text style={styles.liveDot}>●</Text>
          <Text style={styles.liveText}>LIVE</Text>
        </Pressable>

        {/* Center navigation tabs */}
        <View style={styles.centerTabs}>
          {/* STEM tab (active) */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabActive}>STEM</Text></Pressable>
          {/* Explore tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabDim}>Explore</Text></Pressable>
          {/* Following tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabDim}>Following</Text></Pressable>
          {/* For You tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabDim}>For You</Text></Pressable>
        </View>

        {/* Search icon button */}
        <Pressable onPress={() => router.push("/search" as Href)} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </SafeAreaView>
      {/* Central play button (decorative) */}
      <Pressable onPress={() => router.push("/post" as Href)} style={styles.playBtn}>
        <MaterialIcons name="play-arrow" size={56} color="rgba(255,255,255,0.9)" />
      </Pressable>

      {/* Caption overlay */}
      <View style={styles.captionWrap}>
        {/* Caption text */}
        <Text style={styles.captionText}>
          POV: when you catch your married boss flirting with another woman that’s not his wife
        </Text>
      </View>

      {/* Right action rail */}
      <View style={styles.rightRail}>
        {/* User avatar with plus badge */}
        <Pressable onPress={() => router.push("/user" as Href)} style={styles.avatarWrap}>
          <View style={styles.avatar} />
          <View style={styles.plusBadge}><Text style={styles.plus}>＋</Text></View>
        </Pressable>

        {/* Like button */}
        <Pressable onPress={() => router.push("/post" as Href)} style={styles.railBtn}>
          <Ionicons name="heart" size={28} color="#fff" />
          <Text style={styles.railCount}>22.3K</Text>
        </Pressable>
        {/* Comment button */}
        <Pressable onPress={() => router.push("/(modals)/comments" as Href)} style={styles.railBtn}>
          <Ionicons name="chatbubble" size={26} color="#fff" />
          <Text style={styles.railCount}>142</Text>
        </Pressable>
        {/* Share button */}
        <Pressable onPress={() => router.push("/(modals)/share" as Href)} style={styles.railBtn}>
          <Ionicons name="share-social" size={26} color="#fff" />
          <Text style={styles.railCount}>551</Text>
        </Pressable>
        {/* Bookmark button */}
        <Pressable onPress={() => router.push("/post" as Href)} style={styles.railBtn}>
          <Ionicons name="bookmark" size={24} color="#fff" />
          <Text style={styles.railCount}>797</Text>
        </Pressable>
      </View>

      {/* Bottom overlay area */}
      <View style={styles.bottomArea}>
        {/* User handle */}
        <Text style={styles.handle}>charrrly.k</Text>
        {/* Description text */}
        <Text style={styles.desc} numberOfLines={1}>
          😂 I’m telling my work bestie first @Tyems #fyp #explorepage #viral
        </Text>

        {/* Music row */}
        <Pressable onPress={() => router.push("/music" as Href)} style={styles.musicRow}>
          <Ionicons name="musical-notes" size={14} color="#fff" />
          <Text style={styles.musicText} numberOfLines={1}>Contains: BODY (danz) – …</Text>
        </Pressable>

        {/* Progress scrubber */}
        <View style={styles.scrubberWrap}>
          <View style={styles.scrubber} />
          <View style={styles.scrubberThumb} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  videoPlaceholder: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000" },

  topBar: { position: "absolute", top: 0, left: 0, right: 0, paddingTop: 6, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  livePill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  liveDot: { color: "#ff3b30", fontWeight: "900" },
  liveText: { color: "#fff", fontWeight: "700", letterSpacing: 0.5 },
  topTabDim: { color: "#bbb", fontWeight: "600" },
  topTabActive: { color: "#fff", fontWeight: "800" },
  searchBtn: { padding: 8 },
  centerTabs: { flexDirection: "row", alignItems: "center", gap: 24 },

  playBtn: { position: "absolute", top: "42%", alignSelf: "center", opacity: 0.9 },

  captionWrap: { position: "absolute", top: 120, left: 20, right: 100, backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10, padding: 10 },
  captionText: { color: "#fff", fontWeight: "800", fontSize: 16, lineHeight: 20 },

  rightRail: { position: "absolute", right: 10, top: 160, alignItems: "center", gap: 18 },
  avatarWrap: { alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#999" },
  plusBadge: { position: "absolute", bottom: -4, alignSelf: "center", backgroundColor: "#1da1f2",
    paddingHorizontal: 6, paddingVertical: 0, borderRadius: 10 },
  plus: { color: "#fff", fontSize: 16, fontWeight: "900", lineHeight: 18 },
  railBtn: { alignItems: "center" },
  railCount: { color: "#fff", marginTop: 4, fontSize: 12, fontWeight: "600" },

  bottomArea: { position: "absolute", left: 12, right: 12, bottom: 70 },
  handle: { color: "#fff", fontWeight: "700" },
  desc: { color: "#fff", marginTop: 4 },
  musicRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  musicText: { color: "#fff", flexShrink: 1 },

  scrubberWrap: { height: 18, marginTop: 8, justifyContent: "center" },
  scrubber: { height: 3, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 2 },
  scrubberThumb: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", position: "absolute", left: "40%" },
});
