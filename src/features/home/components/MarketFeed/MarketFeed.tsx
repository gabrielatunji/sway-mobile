import { useMemo, useRef, useCallback } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import type { MockMarket, MarketOption } from '../../../../mocks/mockMarkets';
import { MARKET_LOGOS } from '../../constants';
import { buildOptionColors } from '../../utils/buildOptionColors';

interface MarketFeedProps {
  markets: MockMarket[];
  width: number;
  height: number;
  onMarketInView: (index: number) => void;
  likedMap: Record<string, boolean>;
  likeAnims: React.MutableRefObject<Record<string, Animated.Value>>;
  onToggleLike: (marketId: string) => void;
  formatPrice: (value: number) => string;
  onReminderPress: () => void;
}

export const MarketFeed = ({
  markets,
  width,
  height,
  onMarketInView,
  likedMap,
  likeAnims,
  onToggleLike,
  formatPrice,
  onReminderPress,
}: MarketFeedProps) => {
  const router = useRouter();
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems?.length) return;
      const first = viewableItems[0];
      if (typeof first.index === 'number') {
        onMarketInView(first.index);
      }
    },
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<MockMarket> | null | undefined, index: number) => ({
      length: height,
      offset: height * index,
      index,
    }),
    [height],
  );

  const handleLikePress = useCallback(
    (marketId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onToggleLike(marketId);
      if (!likeAnims.current[marketId]) {
        likeAnims.current[marketId] = new Animated.Value(1);
      }
      Animated.sequence([
        Animated.timing(likeAnims.current[marketId], {
          toValue: 1.3,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(likeAnims.current[marketId], {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [likeAnims, onToggleLike],
  );

  const ensureLikeAnim = useCallback(
    (marketId: string) => {
      if (!likeAnims.current[marketId]) {
        likeAnims.current[marketId] = new Animated.Value(1);
      }
      return likeAnims.current[marketId];
    },
    [likeAnims],
  );

  const renderItem = useCallback(
    ({ item }: { item: MockMarket }) => (
      <MarketCard
        market={item}
        width={width}
        height={height}
        liked={!!likedMap[item.id]}
        likeAnim={ensureLikeAnim(item.id)}
        onLike={() => handleLikePress(item.id)}
        onShare={() => router.push('/(modals)/share' as Href)}
        onReminder={onReminderPress}
        formatPrice={formatPrice}
      />
    ),
    [ensureLikeAnim, formatPrice, handleLikePress, height, likedMap, onReminderPress, router, width],
  );

  return (
    <FlatList
      data={markets}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      initialNumToRender={2}
      maxToRenderPerBatch={3}
      windowSize={3}
      style={{ flex: 1 }}
    />
  );
};

interface MarketCardProps {
  market: MockMarket;
  width: number;
  height: number;
  liked: boolean;
  likeAnim: Animated.Value;
  onLike: () => void;
  onShare: () => void;
  onReminder: () => void;
  formatPrice: (value: number) => string;
}

const MarketCard = ({
  market,
  width,
  height,
  liked,
  likeAnim,
  onLike,
  onShare,
  onReminder,
  formatPrice,
}: MarketCardProps) => {
  const marketLogoUri = MARKET_LOGOS[market.source];
  const options: MarketOption[] = market.options ?? [
    { label: 'Yes', value: market.prices?.yes ?? 0 },
    { label: 'No', value: market.prices?.no ?? 0 },
  ];
  const optionColors = useMemo(() => buildOptionColors(options), [options]);
  const shadowColor = useMemo(() => {
    if (market.source === 'polymarket') return '#1da1f2';
    if (market.source === 'manifold') return '#ff0050';
    if (market.source === 'kalshi') return '#22c55e';
    return '#ffffff';
  }, [market.source]);

  return (
    <View style={{ width, height }}>
      <Image source={market.image} style={styles.picture} resizeMode="cover" />
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
        <Pressable onPress={onLike} style={styles.railBtn}>
          <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
            <Ionicons name="heart" size={38} color={liked ? '#ff3b3b' : '#fff'} />
          </Animated.View>
        </Pressable>
        <Pressable onPress={onShare} style={styles.railBtn}>
          <Ionicons name="share-social" size={34} color="#fff" />
        </Pressable>
        <Pressable onPress={onReminder} style={styles.railBtn}>
          <Ionicons name="time" size={32} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.bottomArea}>
        <Text style={styles.headline}>{market.headline}</Text>
        <View style={options.length === 2 ? styles.dualRow : styles.multiRow}>
          {options.map((option, idx) => {
            if (options.length === 2) {
              const boxStyle = idx === 0 ? styles.yesBox : styles.noBox;
              return (
                <View
                  key={option.label}
                  style={[boxStyle, { flex: 1, marginHorizontal: 6 }]}
                >
                  <Text style={styles.dualOption} numberOfLines={2} ellipsizeMode="tail">
                    {option.label}{' '}
                    <Text style={styles.dualPrice}>{formatPrice(option.value)}</Text>
                  </Text>
                </View>
              );
            }

            const color = optionColors[idx] ?? '#222';
            const manyOptions = options.length > 4;
            const containerStyle = manyOptions ? styles.optionBoxWide : styles.optionBox;

            return (
              <View
                key={option.label}
                style={[containerStyle, { backgroundColor: color }]}
              >
                <View style={styles.optionRow}>
                  <OptionLabel label={option.label} />
                  <Text style={styles.optionPrice}>{formatPrice(option.value)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const OptionLabel = ({ label }: { label: string }) => (
  <View style={styles.optionLabelWrap}>
    {label.split(' ').map((word) => (
      <Text key={word} style={styles.optionLabel}>
        {word}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  picture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  marketLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  marketLogoAbsolute: {
    position: 'absolute',
    top: 110,
    left: 20,
    zIndex: 20,
  },
  rightRail: {
    position: 'absolute',
    right: 18,
    top: '50%',
    transform: [{ translateY: -80 }],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  railBtn: {
    alignItems: 'center',
  },
  bottomArea: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 90,
    gap: 12,
    alignItems: 'flex-start',
  },
  headline: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    paddingRight: 12,
  },
  dualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  multiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 12,
  },
  yesBox: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    maxWidth: '60%',
    flexShrink: 1,
  },
  noBox: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    maxWidth: '60%',
    flexShrink: 1,
  },
  dualOption: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
    textAlign: 'center',
  },
  dualPrice: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: 14,
  },
  optionBox: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: '48%',
    flexShrink: 1,
  },
  optionBoxWide: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    maxWidth: '48%',
    flexShrink: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  optionLabelWrap: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  optionLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'left',
  },
  optionPrice: {
    fontWeight: '600',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginLeft: 8,
  },
});
