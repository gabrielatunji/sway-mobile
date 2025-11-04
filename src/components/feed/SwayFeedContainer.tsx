import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwayTopNavigation, { SwayFeedTab } from './SwayTopNavigation';
import SwayActionButtons from './SwayActionButtons';
import SwayBottomOverlay from './SwayBottomOverlay';
import SwayBottomTabs from './SwayBottomTabs';
import SwayMarketCard, { SwayMarket } from '../market/SwayMarketCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_SPACING = 12;
const SNAP_INTERVAL = SCREEN_HEIGHT - 80; // allow slight preview of next card

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<SwayMarket>);

interface SwayFeedContainerProps {
  markets: SwayMarket[];
  onRefresh?: () => Promise<void> | void;
  onEndReached?: () => void;
  onActiveIndexChange?: (index: number) => void;
}

export default function SwayFeedContainer({
  markets,
  onRefresh,
  onEndReached,
  onActiveIndexChange,
}: SwayFeedContainerProps) {
  const [activeTab, setActiveTab] = useState<SwayFeedTab>('For You');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedMarkets, setFeedMarkets] = useState<SwayMarket[]>(markets);
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const hasTriggeredLoadMore = useRef(false);

  useEffect(() => {
    setFeedMarkets(markets);
    setExpandedCaptions({});
  }, [markets]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const toggleCaption = useCallback((id: string) => {
    setExpandedCaptions((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const onMomentumEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / SNAP_INTERVAL);
      setActiveIndex(newIndex);
    },
    [],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const fractionalIndex = event.contentOffset.y / SNAP_INTERVAL;
      scheduleOnRN(() => setActiveIndex(Math.round(fractionalIndex)));
    },
  });

  const listHeaderSpacer = useMemo(() => ({ height: insets.top + 80 }), [insets.top]);
  const listFooterSpacer = useMemo(() => ({ height: insets.bottom + 100 }), [insets.bottom]);

  const handleUpdate = useCallback(
    (id: string, updater: (market: SwayMarket) => SwayMarket) => {
      setFeedMarkets((prev) => prev.map((market) => (market.id === id ? updater(market) : market)));
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: SwayMarket; index: number }) => {
      const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
          (index - 1) * SNAP_INTERVAL,
          index * SNAP_INTERVAL,
          (index + 1) * SNAP_INTERVAL,
        ];
  const scale = interpolate(scrollY.value, inputRange, [0.9, 1, 0.92], Extrapolation.CLAMP);
  const opacity = interpolate(scrollY.value, inputRange, [0.7, 1, 0.8], Extrapolation.CLAMP);
        return {
          transform: [{ scale }],
          opacity,
        };
      });

      return (
        <Animated.View style={[{ height: SNAP_INTERVAL - CARD_SPACING, marginBottom: CARD_SPACING }, animatedStyle]}>
          <SwayMarketCard
            market={item}
            isActive={index === activeIndex}
            onDoubleTapLike={(id: string) =>
              handleUpdate(id, (market) => ({
                ...market,
                isLiked: !market.isLiked,
                likes: market.isLiked ? Math.max(0, market.likes - 1) : market.likes + 1,
              }))
            }
          />
        </Animated.View>
      );
    },
    [activeIndex, handleUpdate, scrollY],
  );

  useEffect(() => {
    if (typeof onActiveIndexChange === 'function') {
      onActiveIndexChange(activeIndex);
    }
  }, [activeIndex, onActiveIndexChange]);

  useEffect(() => {
    hasTriggeredLoadMore.current = false;
  }, [feedMarkets.length]);

  useEffect(() => {
    if (!onEndReached) return;
    if (!feedMarkets.length) return;

    const thresholdIndex = Math.max(feedMarkets.length - 2, 0);
    if (activeIndex >= thresholdIndex && !hasTriggeredLoadMore.current) {
      hasTriggeredLoadMore.current = true;
      onEndReached();
    } else if (activeIndex < thresholdIndex) {
      hasTriggeredLoadMore.current = false;
    }
  }, [activeIndex, feedMarkets.length, onEndReached]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SwayTopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatedFlatList
        data={feedMarkets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          onRefresh
            ? (
                <RefreshControl
                  tintColor="#fff"
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              )
            : undefined
        }
        ListHeaderComponent={<View style={listHeaderSpacer} />}
        ListFooterComponent={<View style={listFooterSpacer} />}
      />

      {feedMarkets[activeIndex] && (
        <>
          <SwayActionButtons
            market={feedMarkets[activeIndex]}
            onToggleFollow={(id: string, value: boolean) =>
              handleUpdate(id, (market) => ({
                ...market,
                isFollowing: value,
              }))
            }
            onToggleLike={(id: string, value: boolean) =>
              handleUpdate(id, (market) => ({
                ...market,
                isLiked: value,
                likes: value ? market.likes + 1 : Math.max(0, market.likes - 1),
              }))
            }
            onToggleBookmark={(id: string, value: boolean) =>
              handleUpdate(id, (market) => ({
                ...market,
                isBookmarked: value,
                bookmarks: value ? market.bookmarks + 1 : Math.max(0, market.bookmarks - 1),
              }))
            }
          />
          <SwayBottomOverlay
            market={feedMarkets[activeIndex]}
            isCaptionExpanded={expandedCaptions[feedMarkets[activeIndex].id]}
            onToggleExpandedCaption={toggleCaption}
          />
        </>
      )}

      <SwayBottomTabs />
    </View>
  );
}
