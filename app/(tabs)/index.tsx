import { useCallback, useMemo } from 'react';
import { useFeed } from '../../src/hooks/useFeed';
import SwayFeedContainer from '../../src/components/feed/SwayFeedContainer';
import type { SwayMarket } from '../../src/components/market/SwayMarketCard';
import { useFeedStore } from '../../src/store/feedStore';
import type { FeedState } from '../../src/store/feedStore';

type RawMarket = Record<string, any> | undefined | null;

const FALLBACK_IMAGE = 'https://placehold.co/600x800?text=Sway';

function adaptMarket(raw: RawMarket): SwayMarket {
  const market = raw ?? {};
  const oddsYes = Number(market?.odds?.yes ?? market?.yesOdds ?? 50);
  const oddsNo = Number(market?.odds?.no ?? market?.noOdds ?? 50);

  return {
    id: String(
      market.id ??
        market._id ??
        market.marketId ??
        globalThis.crypto?.randomUUID?.() ?? `temp-${Date.now()}-${Math.random()}`,
    ),
    title: market.title ?? 'Untitled market',
    description: market.description ?? 'No description provided yet.',
    category: market.category ?? 'General',
    thumbnailUrl: market.thumbnailUrl ?? market.imageUrl ?? FALLBACK_IMAGE,
    creator: market.creator?.handle ?? market.creator?.username ?? market.creator ?? 'anonymous',
    creatorAvatar: market.creatorAvatar ?? market.creator?.avatar ?? '',
    source: market.source ?? market.signalSource ?? 'Sway',
    sourceLogo: market.sourceLogo ?? market.signalSourceLogo ?? '',
    odds: {
      yes: Number.isFinite(oddsYes) ? oddsYes : 50,
      no: Number.isFinite(oddsNo) ? oddsNo : 50,
    },
    volume: Number(market.volume ?? market.totalVolume ?? 0),
    endDate: market.endDate ?? market.closesAt ?? market.expiry ?? '',
    likes: Number(market.likes ?? 0),
    comments: Number(market.comments ?? 0),
    shares: Number(market.shares ?? 0),
    bookmarks: Number(market.bookmarks ?? 0),
    isLiked: Boolean(market.isLiked ?? false),
    isBookmarked: Boolean(market.isBookmarked ?? false),
    isFollowing: Boolean(market.isFollowing ?? false),
  };
}

export default function ForYouFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeed('forYou');
  const setIndex = useFeedStore((state: FeedState) => state.setIndex);

  const flattenedMarkets = useMemo(
    () => (data?.pages ?? []).flatMap((page: any) => page?.markets ?? []),
    [data?.pages],
  );

  const adaptedMarkets = useMemo(
    () => flattenedMarkets.map((market: RawMarket) => adaptMarket(market)),
    [flattenedMarkets],
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <SwayFeedContainer
      markets={adaptedMarkets}
      onRefresh={handleRefresh}
      onEndReached={handleEndReached}
      onActiveIndexChange={setIndex}
    />
  );
}
