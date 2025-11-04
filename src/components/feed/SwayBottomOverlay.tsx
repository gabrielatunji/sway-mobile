import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SwayMarket } from '../market/SwayMarketCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SwayBottomOverlayProps {
  market: SwayMarket;
  onToggleExpandedCaption?: (id: string) => void;
  isCaptionExpanded?: boolean;
}

function truncateCaption(text: string, isExpanded?: boolean): string {
  if (isExpanded || text.length <= 120) return text;
  return `${text.slice(0, 117)}...`;
}

function SwayBottomOverlayComponent({ market, onToggleExpandedCaption, isCaptionExpanded }: SwayBottomOverlayProps) {
  const caption = truncateCaption(market.description, isCaptionExpanded);
  const showSeeMore = !isCaptionExpanded && market.description.length > 120;
  const insets = useSafeAreaInsets();
  const bottomTabsHeight = 60 + insets.bottom;
  const bottomOffset = bottomTabsHeight + 28;

  return (
    <View
      className="absolute left-3 right-24"
      style={{ bottom: bottomOffset }}
    >
      <Text className="text-white text-sm font-semibold mb-1">@{market.creator}</Text>
      <Text className="text-white text-sm" numberOfLines={isCaptionExpanded ? undefined : 2}>
        {caption}
      </Text>
      {showSeeMore && (
        <Pressable onPress={() => onToggleExpandedCaption?.(market.id)}>
          <Text className="text-white/70 text-xs mt-1">See more</Text>
        </Pressable>
      )}

      <Text className="text-white/60 text-xs mt-3">♪ Source: {market.source}</Text>
    </View>
  );
}

const SwayBottomOverlay = memo(SwayBottomOverlayComponent);
export default SwayBottomOverlay;
