
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
              // Support both old and new mockMarkets format
              // If item.options exists, use it; else fallback to Yes/No
              const options = item.options || [
                { label: 'Yes', value: item.prices?.yes },
                { label: 'No', value: item.prices?.no },
              ];
              // Dynamic color assignment for options
              let optionColors: string[] = [];
              if (options.length === 2) {
                optionColors = [styles.yesBoxDynamic.backgroundColor, styles.noBoxDynamic.backgroundColor];
              } else if (options.length > 2) {
                // Sort options by value descending, but keep original order for rendering
                const sorted = [...options].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
                const max = sorted[0]?.value ?? 1;
                const min = sorted[sorted.length - 1]?.value ?? 0;
                // Color stops: green (#22c55e) to red (#dc2626)
                // We'll interpolate between green and red for intermediate options
                const getColor = (rank: number, total: number) => {
                  if (rank === 0) return '#22c55e'; // highest: green
                  if (rank === total - 1) return '#dc2626'; // lowest: red
                  // interpolate between green and red
                  // green: 34,197,94; red: 220,38,38
                  const t = rank / (total - 1);
                  const r = Math.round(34 + (220 - 34) * t);
                  const g = Math.round(197 + (38 - 197) * t);
                  const b = Math.round(94 + (38 - 94) * t);
                  return `rgb(${r},${g},${b})`;
                };
                // Map original options to their color by rank in sorted array
                optionColors = options.map(opt => {
                  const rank = sorted.findIndex(o => o.label === opt.label && o.value === opt.value);
                  return getColor(rank, options.length);
                });
              }
              return (
                <View style={{ width, height }}> 
                  <Image source={item.image} style={styles.picturePlaceholder} resizeMode="cover" />
                  <View style={styles.rightRail}>
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
                    <Pressable onPress={() => handlePlaceholder("reminder clip")} style={styles.railBtn}>
                      <Ionicons name="time" size={24} color="#fff" />
                    </Pressable>
                  </View>
                  <Image source={marketLogoUri} style={[styles.marketLogo, styles.marketLogoAbsolute]} />
                  <View style={styles.bottomAreaDynamic}>
                    <Text style={styles.headlineTextDynamic}>{item.headline}</Text>
                    <View
                      style={[
                        options.length === 2 ? styles.yesNoRow : styles.yesNoRow2Plus,
                      ]}
                    >
                      {options.map((opt, idx) => {
                        if (options.length === 2) {
                          // Yes/No: use yesBox/noBox, yesNoRow
                          return (
                            <View
                              key={idx}
                              style={[
                                idx === 0 ? styles.yesBox : styles.noBox,
                                { flex: 1, marginHorizontal: 6, minWidth: 0, maxWidth: '60%' },
                              ]}
                            >
                              <Text style={styles.optionText} numberOfLines={2} ellipsizeMode="tail">
                                {opt.label} <Text style={styles.priceText}>{opt.value !== undefined ? formatPrice(opt.value) : ''}</Text>
                              </Text>
                            </View>
                          );
                        } else {
                          // Multi-option: wrap each word of label, value center-aligned beside label
                          const words = opt.label.split(' ');
                          // If more than 4 options, use same box size for all (2 per row)
                          const manyOptions = options.length > 4;
                          return (
                            <View
                              key={idx}
                              style={[
                                manyOptions
                                  ? [styles.optionBox2PlusWide, { backgroundColor: optionColors[idx] }]
                                  : idx === 0
                                  ? styles.yesBox2Plus
                                  : idx === 1 && options.length === 2
                                  ? styles.noBox2Plus
                                  : [styles.optionBox2Plus, { backgroundColor: optionColors[idx] }],
                                { marginRight: 12, marginBottom: 12 },
                              ]}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                  {words.map((word, i) => (
                                    <Text key={i} style={styles.optionLabel2Plus}>{word}</Text>
                                  ))}
                                </View>
                                <Text style={[styles.priceText2Plus, { marginLeft: 8, alignSelf: 'center' }]}>{opt.value !== undefined ? formatPrice(opt.value) : ''}</Text>
                              </View>
                            </View>
                          );
                        }
                      })}
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
  yesNoRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    alignItems: 'flex-start',
  },
  yesNoRow2Plus: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    alignItems: 'flex-start',
  },
  yesBox: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    maxWidth: '60%',
    flexShrink: 1,
  },
  noBox: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    maxWidth: '60%',
    flexShrink: 1,
  },
  yesBox2Plus: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    maxWidth: '100%',
    marginRight: 12,
    marginBottom: 0,
    flexShrink: 1,
  },
  noBox2Plus: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    maxWidth: '100%',
    marginRight: 0,
    marginBottom: 0,
    flexShrink: 1,
  },
  optionBox2Plus: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: '48%',
    flexShrink: 1,
  },
  optionBox2PlusWide: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    maxWidth: '48%',
    flexShrink: 1,
  },
  optionText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
    textAlign: 'center',
    flexShrink: 1,
  },
  priceText: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 0,
  },
  optionLabel2Plus: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  priceText2Plus: {
    fontWeight: "600",
    fontSize: 18,
    color: "#ffffffff",
    textAlign: 'center',
  },
  rightRail: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -140 }],
    alignItems: "center",
    gap: 18,
  },
  marketLogo: { width: 44, height: 44, borderRadius: 10 },
  marketLogoAbsolute: {
    position: 'absolute',
    top: 110,
    left: 20,
    zIndex: 20,
  },
  topBarSpacer: { width: 40 },
  centerTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 36,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
  },
  topTabDim: { color: "#bbb", fontWeight: "600" },
  topTabActive: { color: "#fff", fontWeight: "800" },
  searchBtn: { padding: 8 },
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

  // Auto-resizing yes/no for 2 options
  yesBoxAuto: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    maxWidth: '100%',
    flexShrink: 1,
  },
  noBoxAuto: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    maxWidth: '100%',
    flexShrink: 1,
  },
  optionTextAuto: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
    textAlign: 'center',
    flexShrink: 1,
  },
  priceTextAuto: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 0,
  },
  railBtn: { alignItems: "center" },
  railCount: { color: "#fff", marginTop: 4, fontSize: 12, fontWeight: "600" },

  // Dynamic bottom area for headline and options
  bottomAreaDynamic: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 48,
    gap: 12,
    alignItems: 'flex-start',
  },
  headlineTextDynamic: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  yesNoRowDynamic: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    alignItems: 'flex-start',
  },
  yesBoxDynamic: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    maxWidth: '100%',
    marginRight: 12,
    marginBottom: 0,
    flexShrink: 1,
  },
  noBoxDynamic: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    maxWidth: '100%',
    marginRight: 0,
    marginBottom: 0,
    flexShrink: 1,
  },
  optionBoxDynamic: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    maxWidth: '100%',
    flexShrink: 1,
  },
  optionTextDynamic: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
    flexShrink: 1,
  },
  // Removed duplicate priceText style
  optionLabelDynamic: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  priceTextDynamic: {
    fontWeight: "600",
    fontSize: 18,
    color: "#ffffffff",
    textAlign: 'center',
  },

  placeholderWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  placeholderTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },
  placeholderDescription: { color: "#aaa", fontSize: 16, textAlign: "center", paddingHorizontal: 32 },
});
