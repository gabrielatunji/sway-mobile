import { useRef, useState, useEffect } from "react";
// MOCK DATA: Replace with real API integration when ready
import { mockMarkets } from '../../src/mocks/mockMarkets';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MARKET_LOGOS: Record<string, any> = {
  polymarket: require('../../src/mocks/mockAssets/polymarket.png'),
  manifold: require('../../src/mocks/mockAssets/manifold.png'),
  kalshi: require('../../src/mocks/mockAssets/kalshi.png'),
};

const MARKET_LABELS: Record<string, string> = {
  polymarket: "Polymarket",
  manifold: "Manifold",
  kalshi: "Kalshi",
};

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(2);
  // Scroll to the Markets page on mount so the correct content is visible by default
  useEffect(() => {
    if (activeIndex !== 0 && scrollRef.current) {
      // Timeout ensures ScrollView is ready
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: activeIndex * width, animated: false });
      }, 0);
    }
  }, [activeIndex, width]);

  const handlePlaceholder = (label: string) => {
    console.log(`[home] ${label} coming soon`);
  };

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex(nextIndex);
  };


  // MOCK FEED: Swap this out for real API data when available
  // To use real data, remove the mockMarkets import and replace usages below
  const formatPrice = (value: number) => `${value.toFixed(1)}¢`;
  return (
    <View style={styles.container}>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.pager}
      >
        {/* My Bets */}
        <View style={[styles.page, { width, height }]}> 
          <View style={styles.placeholderWrap}>
            <Text style={styles.placeholderTitle}>My Bets</Text>
            <Text style={styles.placeholderDescription}>Track your positions here soon.</Text>
          </View>
        </View>

        {/* Watch List */}
        <View style={[styles.page, { width, height }]}> 
          <View style={styles.placeholderWrap}>
            <Text style={styles.placeholderTitle}>Watch List</Text>
            <Text style={styles.placeholderDescription}>Curated feed coming soon.</Text>
          </View>
        </View>

        {/* Markets */}
        <View style={[styles.page, { width, height }]}> 
          <FlatList
            data={mockMarkets}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            decelerationRate="fast"
            renderItem={({ item }) => {
              const marketLogoUri = MARKET_LOGOS[item.source];
              const marketSourceLabel = MARKET_LABELS[item.source] ?? "Market";
              return (
                <View style={{ width, height }}> 
                  <Image source={item.image} style={styles.picturePlaceholder} resizeMode="cover" />
                  <View style={styles.rightRail}>
                    <Pressable onPress={() => router.push("/user" as Href)} style={styles.avatarWrap}>
                      <View style={styles.avatar} />
                      <View style={styles.plusBadge}>
                        <Text style={styles.plus}>＋</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => handlePlaceholder("like clip")} style={styles.railBtn}>
                      <Ionicons name="heart" size={28} color="#fff" />
                      <Text style={styles.railCount}>22.3K</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push("/(modals)/comments" as Href)} style={styles.railBtn}>
                      <Ionicons name="chatbubble" size={26} color="#fff" />
                      <Text style={styles.railCount}>142</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push("/(modals)/share" as Href)} style={styles.railBtn}>
                      <Ionicons name="share-social" size={26} color="#fff" />
                      <Text style={styles.railCount}>551</Text>
                    </Pressable>
                    <Pressable onPress={() => handlePlaceholder("bookmark clip")} style={styles.railBtn}>
                      <Ionicons name="bookmark" size={24} color="#fff" />
                      <Text style={styles.railCount}>797</Text>
                    </Pressable>
                  </View>
                  <Image source={marketLogoUri} style={[styles.marketLogo, styles.marketLogoAbsolute]} />
                  <View style={styles.bottomArea}>
                    <Text style={styles.headlineText}>{item.headline}</Text>
                    <View style={styles.yesNoRow}>
                      <View style={styles.yesBox}>
                        <Text style={styles.yesText}>
                          Yes <Text style={styles.priceText}>{formatPrice(item.prices.yes)}</Text>
                        </Text>
                      </View>
                      <View style={styles.noBox}>
                        <Text style={styles.noText}>
                          No <Text style={styles.priceText}>{formatPrice(item.prices.no)}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>

      <SafeAreaView style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <View style={styles.centerTabs}>
          <Pressable onPress={() => handleTabPress(0)}>
            <Text style={activeIndex === 0 ? styles.topTabActive : styles.topTabDim}>My Bets</Text>
          </Pressable>
          <Pressable onPress={() => handleTabPress(1)}>
            <Text style={activeIndex === 1 ? styles.topTabActive : styles.topTabDim}>Watch List</Text>
          </Pressable>
          <Pressable onPress={() => handleTabPress(2)}>
            <Text style={activeIndex === 2 ? styles.topTabActive : styles.topTabDim}>Markets</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => router.push("/search" as Href)} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  pager: { flex: 1 },
  pagerContent: { height: "100%" },
  page: { height: "100%" },
  pageContent: { flex: 1 },
  marketSlide: { width: "100%", height: "100%" },
  carousel: { flex: 1 },
  // 9:16 aspect ratio background image (fills screen, centered)
  picturePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 6,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
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

  captionWrap: {
    position: "absolute",
    top: 110,
    left: 20,
    right: 120,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  captionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  marketLogo: { width: 44, height: 44, borderRadius: 10 },
  marketLogoAbsolute: {
    position: 'absolute',
    top: 110,
    left: 20,
    zIndex: 20,
  },
  marketSource: { color: "#fff", fontWeight: "700", fontSize: 18 },

  rightRail: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -140 }],
    alignItems: "center",
    gap: 18,
  },
  avatarWrap: { alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#999" },
  plusBadge: {
    position: "absolute",
    bottom: -4,
    alignSelf: "center",
    backgroundColor: "#1da1f2",
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderRadius: 10,
  },
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

  placeholderWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  placeholderTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },
  placeholderDescription: { color: "#aaa", fontSize: 16, textAlign: "center", paddingHorizontal: 32 },
});
