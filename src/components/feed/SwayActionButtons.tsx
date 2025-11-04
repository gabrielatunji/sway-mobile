import { memo, useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import SwaySpinningDisc from '../market/SwaySpinningDisc';
import type { SwayMarket } from '../market/SwayMarketCard';
import SwayFollowAnimation from '../animations/SwayFollowAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SwayActionButtonsProps {
  market: SwayMarket;
  onToggleFollow?: (id: string, nextValue: boolean) => void;
  onToggleLike?: (id: string, nextValue: boolean) => void;
  onToggleBookmark?: (id: string, nextValue: boolean) => void;
  onOpenComments?: (id: string) => void;
  onShare?: (id: string) => void;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
}

function SwayActionButtonsComponent({
  market,
  onToggleFollow,
  onToggleLike,
  onToggleBookmark,
  onOpenComments,
  onShare,
}: SwayActionButtonsProps) {
  const likeScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);
  const shareScale = useSharedValue(1);
  const insets = useSafeAreaInsets();
  const bottomTabsHeight = 60 + insets.bottom;
  const bottomOffset = bottomTabsHeight + 16;

  const animate = useCallback((sharedValue: SharedValue<number>) => {
    sharedValue.value = withSpring(1.25, { damping: 7, stiffness: 200 }, () => {
      sharedValue.value = withTiming(1, { duration: 120 });
    });
  }, []);

  const likeStyle = useAnimatedStyle(() => ({ transform: [{ scale: likeScale.value }] }));
  const bookmarkStyle = useAnimatedStyle(() => ({ transform: [{ scale: bookmarkScale.value }] }));
  const shareStyle = useAnimatedStyle(() => ({ transform: [{ scale: shareScale.value }] }));

  const handleLikePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animate(likeScale);
    onToggleLike?.(market.id, !market.isLiked);
  };

  const handleBookmarkPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animate(bookmarkScale);
    onToggleBookmark?.(market.id, !market.isBookmarked);
  };

  const handleSharePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    animate(shareScale);
    onShare?.(market.id);
  };

  return (
    <View
      className="absolute right-3 items-center"
      style={{ rowGap: 20, bottom: bottomOffset }}
    >
      <View className="items-center">
        <Image
          source={{ uri: market.creatorAvatar }}
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggleFollow?.(market.id, !market.isFollowing);
          }}
          className="absolute -bottom-3"
        >
          <SwayFollowAnimation isFollowing={market.isFollowing} />
        </Pressable>
      </View>

      <Pressable onPress={handleLikePress} className="items-center">
        <Animated.View style={likeStyle} className="items-center">
          <Text style={{ fontSize: 32 }}>
            {market.isLiked ? '❤️' : '🤍'}
          </Text>
        </Animated.View>
        <Text className="text-white text-xs font-semibold mt-1">
          {formatCount(market.likes)}
        </Text>
      </Pressable>

      <Pressable onPress={() => onOpenComments?.(market.id)} className="items-center">
        <Text style={{ fontSize: 32 }}>💬</Text>
        <Text className="text-white text-xs font-semibold mt-1">
          {formatCount(market.comments)}
        </Text>
      </Pressable>

      <Pressable onPress={handleBookmarkPress} className="items-center">
        <Animated.View style={bookmarkStyle}>
          <Text style={{ fontSize: 32 }}>
            {market.isBookmarked ? '🔖' : '📑'}
          </Text>
        </Animated.View>
        <Text className="text-white text-xs font-semibold mt-1">
          {formatCount(market.bookmarks)}
        </Text>
      </Pressable>

      <Pressable onPress={handleSharePress} className="items-center">
        <Animated.View style={shareStyle}>
          <Text style={{ fontSize: 32 }}>↗️</Text>
        </Animated.View>
        <Text className="text-white text-xs font-semibold mt-1">
          {formatCount(market.shares)}
        </Text>
      </Pressable>

      <SwaySpinningDisc imageUrl={market.sourceLogo} />
    </View>
  );
}

const SwayActionButtons = memo(SwayActionButtonsComponent);
export default SwayActionButtons;
