import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { mockMarkets, type MockMarket, type MarketOption } from '../../mocks/mockMarkets';
import { generateMockChartData } from '../../mocks/mockChartData';
import { HomePager } from './components/HomePager';
import { PlaceholderPage } from './components/PlaceholderPage';
import { TopTabBar } from './components/TopTabBar';
import { MarketFeed } from './components/MarketFeed/MarketFeed';
import { MarketDetail } from './components/MarketDetail/MarketDetail';

const DETAIL_PAGE_INDEX = 3;

const formatPrice = (value: number) => `${value.toFixed(1)}¢`;

export const HomeView = () => {
  const router = useRouter();
  const pagerRef = useRef<ScrollView | null>(null);
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const likeAnims = useRef<Record<string, Animated.Value>>({});

  const selectedMarket: MockMarket | undefined = mockMarkets[selectedMarketIndex];
  const detailOptions: MarketOption[] = useMemo(() => {
    if (!selectedMarket) return [];
    return (
      selectedMarket.options ?? [
        { label: 'Yes', value: selectedMarket.prices?.yes ?? 0 },
        { label: 'No', value: selectedMarket.prices?.no ?? 0 },
      ]
    );
  }, [selectedMarket]);

  const detailChartData = useMemo(() => generateMockChartData(detailOptions), [detailOptions]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      pagerRef.current?.scrollTo({ x: activeIndex * width, animated: false });
    }, 0);
    return () => clearTimeout(timeout);
  }, [width]);

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    setIsDetailVisible(false);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex(nextIndex);
    setIsDetailVisible(nextIndex === DETAIL_PAGE_INDEX);
  };

  const handleHorizontalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    const fractionalIndex = offsetX / width;
    setIsDetailVisible(fractionalIndex >= DETAIL_PAGE_INDEX - 0.4);
  };

  const handleMarketInView = (index: number) => {
    setSelectedMarketIndex(index);
  };

  const handleToggleLike = (marketId: string) => {
    setLikedMap((prev) => ({ ...prev, [marketId]: !prev[marketId] }));
  };

  const handleReminder = () => {
    console.log('[home] reminder clip coming soon');
  };

  const handleSearch = () => {
    router.push('/search' as Href);
  };

  return (
    <View style={styles.container}>
      <HomePager
        ref={pagerRef}
        width={width}
        height={height}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleHorizontalScroll}
        scrollEventThrottle={16}
      >
        <PlaceholderPage
          title="My Bets"
          description="Track your positions here soon."
        />
        <PlaceholderPage
          title="Watch List"
          description="Curated feed coming soon."
        />
        <MarketFeed
          markets={mockMarkets}
          width={width}
          height={height}
          onMarketInView={handleMarketInView}
          likedMap={likedMap}
          likeAnims={likeAnims}
          onToggleLike={handleToggleLike}
          formatPrice={formatPrice}
          onReminderPress={handleReminder}
        />
        {selectedMarket ? (
          <MarketDetail
            market={selectedMarket}
            options={detailOptions}
            chartData={detailChartData}
            formatPrice={formatPrice}
          />
        ) : (
          <PlaceholderPage
            title="No market selected"
            description="Scroll the feed to pick a market."
          />
        )}
      </HomePager>

      {!isDetailVisible && (
        <SafeAreaView style={styles.topBar}>
          <TopTabBar
            activeIndex={activeIndex}
            onTabPress={handleTabPress}
            onSearchPress={handleSearch}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
