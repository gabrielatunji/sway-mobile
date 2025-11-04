import { memo, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import MarketOddsPills from './SwayMarketOddsPills';
import SwayLikeAnimation from '../animations/SwayLikeAnimation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SwayMarketOdds {
  yes: number;
  no: number;
}

export interface SwayMarket {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  creator: string;
  creatorAvatar: string;
  source: string;
  sourceLogo: string;
  odds: SwayMarketOdds;
  volume: number;
  endDate: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
}

interface SwayMarketCardProps {
  market: SwayMarket;
  isActive: boolean;
  onDoubleTapLike?: (id: string) => void;
}

function SwayMarketCardComponent({ market, isActive, onDoubleTapLike }: SwayMarketCardProps) {
  const scale = useSharedValue(1);
  const lastTap = useRef<number>(0);
  const [likeTrigger, setLikeTrigger] = useState(0);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isActive ? scale.value : 0.96 }],
  }));

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 250) {
      scale.value = 1.2;
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      setLikeTrigger((prev) => prev + 1);
      onDoubleTapLike?.(market.id);
    }
    lastTap.current = now;
  };

  const odds = useMemo(
    () => ({ yes: market.odds.yes, no: market.odds.no }),
    [market.odds.no, market.odds.yes],
  );

  return (
    <Animated.View style={[{ flex: 1, borderRadius: 24, overflow: 'hidden' }, containerAnimatedStyle]}>
  <Pressable onPress={handleTap} style={{ flex: 1 }}>
        <Image
          source={{ uri: market.thumbnailUrl }}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' }}
          blurRadius={20}
        />

        <View style={styles.overlay} />

        <SwayLikeAnimation trigger={likeTrigger} />

        <View className="absolute top-16 left-4 px-3 py-1 bg-white/30 rounded-full">
          <Text className="text-white text-xs font-semibold">{market.category}</Text>
        </View>

        <View className="absolute top-[25%] left-6 right-6 bg-white/80 rounded-2xl p-4">
          <Text className="text-black text-lg font-bold text-center">{market.title}</Text>
        </View>

        <View className="absolute bottom-24 left-4 right-20">
          <Text className="text-white text-sm font-semibold mb-2">@{market.creator}</Text>
          <Text className="text-white text-sm mb-3" numberOfLines={3}>
            {market.description}
          </Text>

          <MarketOddsPills yesPercentage={odds.yes} noPercentage={odds.no} />

          <Text className="text-white/70 text-xs mt-3">
            ${ (market.volume / 1000).toFixed(1) }K volume • Ends {market.endDate}
          </Text>
          <Text className="text-white/70 text-xs mt-1">♪ Source: {market.source}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const SwayMarketCard = memo(SwayMarketCardComponent);
export default SwayMarketCard;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});
