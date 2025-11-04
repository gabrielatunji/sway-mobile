import { useRouter, type Href } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MARKET_LOGOS: Record<string, string> = {
  polymarket: "https://placehold.co/56x56/101828/FFFFFF?text=PM",
  predictit: "https://placehold.co/56x56/0f172a/FFFFFF?text=PI",
  kalshi: "https://placehold.co/56x56/1e293b/FFFFFF?text=KA",
  default: "https://placehold.co/56x56/111111/FFFFFF?text=EX",
};

const MARKET_LABELS: Record<string, string> = {
  polymarket: "Polymarket",
  predictit: "PredictIt",
  kalshi: "Kalshi",
};

export default function HomeScreen() {
  const router = useRouter();

  // TODO: Replace with feed-driven market details once available
  const market = {
    source: "polymarket",
    headline: "When will the Government Shutdown end?",
    prices: { yes: 0.8, no: 99.3 },
  };

  const marketLogoUri = MARKET_LOGOS[market.source] ?? MARKET_LOGOS.default;
  const marketSourceLabel = MARKET_LABELS[market.source] ?? "Exact Market";
  const formatPrice = (value: number) => `${value.toFixed(1)}¢`;

  return (
    <View style={styles.container}>
      {/* Video placeholder background */}
      <View style={styles.videoPlaceholder} />

      {/* Top overlay bar */}
      <SafeAreaView style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        {/* Center navigation tabs */}
        <View style={styles.centerTabs}>
          {/* Markets tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabActive}>Markets</Text></Pressable>
          {/* Following tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabDim}>Following</Text></Pressable>
          {/* Your Bets tab */}
          <Pressable onPress={() => router.push("/post" as Href)}><Text style={styles.topTabDim}>Your Bets</Text></Pressable>
        </View>
        {/* Search icon button */}
        <Pressable onPress={() => router.push("/search" as Href)} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </SafeAreaView>

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

      {/* Caption overlay */}
      <View style={styles.captionWrap}>
        <View style={styles.captionHeader}>
          <Image source={{ uri: marketLogoUri }} style={styles.marketLogo} />
          <Text style={styles.marketSource}>{marketSourceLabel}</Text>
        </View>
      </View>


      {/* Bottom overlay area */}
      <View style={styles.bottomArea}>
        <Text style={styles.headlineText}>{market.headline}</Text>
        {/* Yes/No price row */}
        <View style={styles.yesNoRow}>
          <View style={styles.yesBox}>
            <Text style={styles.yesText}>Yes <Text style={styles.priceText}>{formatPrice(market.prices.yes)}</Text></Text>
          </View>
          <View style={styles.noBox}>
            <Text style={styles.noText}>No <Text style={styles.priceText}>{formatPrice(market.prices.no)}</Text></Text>
          </View>
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
  topBarSpacer: { width: 40 },
  topTabDim: { color: "#bbb", fontWeight: "600" },
  topTabActive: { color: "#fff", fontWeight: "800" },
  searchBtn: { padding: 8 },
  centerTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 36,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
  },

  captionWrap: { position: "absolute", top: 110, left: 20, right: 120, backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  captionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  marketLogo: { width: 44, height: 44, borderRadius: 10 },
  marketSource: { color: "#fff", fontWeight: "700", fontSize: 18 },

  rightRail: { position: "absolute", right: 10, top: 160, alignItems: "center", gap: 18 },
  avatarWrap: { alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#999" },
  plusBadge: { position: "absolute", bottom: -4, alignSelf: "center", backgroundColor: "#1da1f2",
    paddingHorizontal: 6, paddingVertical: 0, borderRadius: 10 },
  plus: { color: "#fff", fontSize: 16, fontWeight: "900", lineHeight: 18 },
  railBtn: { alignItems: "center" },
  railCount: { color: "#fff", marginTop: 4, fontSize: 12, fontWeight: "600" },

  bottomArea: { position: "absolute", left: 20, right: 20, bottom: 48, gap: 20 },
  headlineText: { color: "#fff", fontWeight: "800", fontSize: 28, lineHeight: 34 },

  yesNoRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  yesBox: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noBox: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  yesText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
  },
  noText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
  },
  priceText: {
    fontWeight: "600",
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
  },
});
