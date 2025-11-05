
import { useRef, useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import { Animated, Easing } from "react-native";
// MOCK DATA: Replace with real API integration when ready
import { mockMarkets } from '../../src/mocks/mockMarkets';
import { generateMockChartData } from '../../src/mocks/mockChartData';
import { mockComments } from '../../src/mocks/mockComments';
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
  Platform,
  type ViewToken,
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
  const detailPageIndex = 3;
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const selectedMarket = mockMarkets[selectedMarketIndex] ?? mockMarkets[0];
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (!viewableItems?.length) return;
      const firstVisible = viewableItems[0];
      if (firstVisible.index !== null && firstVisible.index !== undefined) {
        setSelectedMarketIndex(firstVisible.index);
      }
    }
  );
  const detailOptions = selectedMarket
    ? selectedMarket.options || [
        { label: 'Yes', value: selectedMarket.prices?.yes },
        { label: 'No', value: selectedMarket.prices?.no },
      ]
    : [];
  const detailChartData = detailOptions.length ? generateMockChartData(detailOptions) : [];
  const detailMarketLogoUri = selectedMarket ? MARKET_LOGOS[selectedMarket.source] : undefined;
  // Scroll to the Markets page on mount so the correct content is visible by default
  useEffect(() => {
    if (scrollRef.current) {
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
    setIsDetailVisible(false);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex(nextIndex);
    setIsDetailVisible(nextIndex === detailPageIndex);
  };

  const handleHorizontalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    const fractionalIndex = offsetX / width;
    setIsDetailVisible(fractionalIndex >= detailPageIndex - 0.4);
  };


  // MOCK FEED: Swap this out for real API data when available
  // To use real data, remove the mockMarkets import and replace usages below
  const formatPrice = (value: number) => `${value.toFixed(1)}¢`;
  // Like animation and state per market
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const likeAnims = useRef<Record<string, Animated.Value>>({});

  const handleLikePress = (marketId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLikedMap((prev) => ({ ...prev, [marketId]: !prev[marketId] }));
    if (!likeAnims.current[marketId]) {
      likeAnims.current[marketId] = new Animated.Value(1);
    }
    Animated.sequence([
      Animated.timing(likeAnims.current[marketId], {
        toValue: 1.3,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(likeAnims.current[marketId], {
        toValue: 1,
        duration: 120,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleHorizontalScroll}
        scrollEventThrottle={16}
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
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
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
              // Determine shadow color based on logo
              let shadowColor = '#fff';
              if (item.source === 'polymarket') shadowColor = '#1da1f2';
              if (item.source === 'manifold') shadowColor = '#ff0050';
              if (item.source === 'kalshi') shadowColor = '#22c55e';
              return (
                <View style={{ width, height }}>
                  <Image source={item.image} style={styles.picturePlaceholder} resizeMode="cover" />
                  <View
                    style={[
                      styles.marketLogoAbsolute,
                      Platform.OS === 'android' && { elevation: 7 },
                    ]}
                  >
                    <Image
                      source={marketLogoUri}
                      style={[
                        styles.marketLogo,
                        {
                          shadowColor,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.45,
                          shadowRadius: 8,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.rightRail}>
                    <Pressable onPress={() => handleLikePress(item.id)} style={styles.railBtn}>
                      <Animated.View style={{ transform: [{ scale: likeAnims.current[item.id] || new Animated.Value(1) }] }}>
                        <Ionicons name="heart" size={38} color={likedMap[item.id] ? "#ff3b3b" : "#fff"} />
                      </Animated.View>
                    </Pressable>
                    <Pressable onPress={() => router.push("/(modals)/share" as Href)} style={styles.railBtn}>
                      <Ionicons name="share-social" size={34} color="#fff" />
                    </Pressable>
                    <Pressable onPress={() => handlePlaceholder("reminder clip")} style={styles.railBtn}>
                      <Ionicons name="time" size={32} color="#fff" />
                    </Pressable>
                  </View>
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

        {/* Market Detail */}
        <View style={[styles.page, { width, height }]}> 
          {selectedMarket ? (
            <ScrollView
              style={styles.detailScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 32, paddingBottom: 120 }}
            >
              <View style={styles.detailHeader}>
                {detailMarketLogoUri ? (
                  <Image source={detailMarketLogoUri} style={styles.detailMarketLogo} />
                ) : null}
                <Text style={styles.detailMarketName}>
                  {selectedMarket?.source ? MARKET_LABELS[selectedMarket.source] : 'Market'}
                </Text>
              </View>

              <Text style={styles.detailHeadline}>{selectedMarket.headline}</Text>

              <View style={styles.detailChartContainer}>
                <View style={styles.detailChartLegend}>
                  {detailChartData.map((series, idx) => (
                    <View key={idx} style={styles.detailLegendItem}>
                      <View style={[styles.detailLegendDot, { backgroundColor: series.color }]} />
                      <Text style={styles.detailLegendText}>
                        {series.label}{' '}
                        {detailOptions[idx]?.value !== undefined ? formatPrice(detailOptions[idx].value!) : ''}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.detailChart}>
                  <Text style={styles.detailChartPlaceholder}>📈</Text>
                  <Text style={styles.detailChartSubtext}>Interactive Chart</Text>
                </View>
              </View>

              <View style={styles.detailOptionsSection}>
                <Text style={styles.detailSectionTitle}>Place Your Bet</Text>
                <View style={styles.detailOptionsRow}>
                  {detailOptions.map((opt, idx) => {
                    let bgColor = '#22c55e';
                    if (idx === 1) bgColor = '#dc2626';
                    else if (idx > 1) bgColor = `hsl(${idx * 60}, 70%, 50%)`;

                    return (
                      <Pressable
                        key={idx}
                        style={[
                          styles.detailOptionBtn,
                          { backgroundColor: bgColor, flex: detailOptions.length === 2 ? 1 : undefined },
                        ]}
                        onPress={() => console.log(`Buy ${opt.label}`)}
                      >
                        <Text style={styles.detailOptionLabel}>{opt.label}</Text>
                        <Text style={styles.detailOptionPrice}>
                          {opt.value !== undefined ? formatPrice(opt.value) : ''}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.detailCommentsSection}>
                <Text style={styles.detailSectionTitle}>Comments ({mockComments.length})</Text>
                {mockComments.slice(0, 5).map((comment) => (
                  <View key={comment.id} style={styles.detailCommentCard}>
                    <View style={styles.detailCommentHeader}>
                      <View style={styles.detailCommentAvatar} />
                      <View style={styles.detailCommentMeta}>
                        <Text style={styles.detailCommentAuthor}>{comment.author}</Text>
                        <Text style={styles.detailCommentTime}>{comment.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.detailCommentText}>{comment.text}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.placeholderWrap}>
              <Text style={styles.placeholderTitle}>No market selected</Text>
              <Text style={styles.placeholderDescription}>Scroll the feed to pick a market.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!isDetailVisible && (
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
      )}
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
    right: 18,
    top: '50%',
    transform: [{ translateY: -80 }],
    alignItems: "center",
    justifyContent: 'center',
    gap: 28,
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
  page: { height: "100%", backgroundColor: '#000' },
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


  // Dynamic bottom area for headline and options
  bottomAreaDynamic: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90,
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
    maxWidth: '70%',
    paddingRight: 12,
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
  
  // Market detail styles
  detailScrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  detailMarketLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  detailMarketName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  detailHeadline: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  detailChartContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  detailChartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailLegendText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  detailChart: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailChartPlaceholder: {
    fontSize: 48,
    marginBottom: 8,
  },
  detailChartSubtext: {
    color: '#888',
    fontSize: 14,
  },
  detailOptionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  detailOptionBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  detailOptionLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  detailOptionPrice: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 14,
  },
  detailCommentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailCommentCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailCommentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  detailCommentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  detailCommentMeta: {
    flex: 1,
  },
  detailCommentAuthor: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  detailCommentTime: {
    color: '#888',
    fontSize: 12,
  },
  detailCommentText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
});
