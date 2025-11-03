import { useRef } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import { useFeed } from '../../src/hooks/useFeed';
import { MarketCard } from '../../src/components/market/MarketCard';
import { useFeedStore } from '../../src/store/feedStore';
import type { FeedState } from '../../src/store/feedStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ForYouFeed() {
  const { data, fetchNextPage, hasNextPage } = useFeed('forYou');
  const currentIndex = useFeedStore((state: FeedState) => state.currentIndex);
  const setIndex = useFeedStore((state: FeedState) => state.setIndex);

  const markets = (data?.pages ?? []).flatMap((p: any) => p?.markets || []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) setIndex(viewableItems[0].index ?? 0);
  });

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={markets}
        renderItem={({ item, index }) => (
          <MarketCard market={item} isActive={index === currentIndex} />
        )}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.6}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, i) => ({ length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * i, index: i })}
      />
    </View>
  );
}
