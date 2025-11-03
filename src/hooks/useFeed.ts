import { useInfiniteQuery } from '@tanstack/react-query';
import { feedService, type FeedResponse } from '../services/feedService';

export function useFeed(feedType: 'forYou' | 'following') {
  return useInfiniteQuery<FeedResponse>({
    queryKey: ['feed', feedType],
    queryFn: ({ pageParam = 0 }) => feedService.getFeed(feedType, pageParam as number),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    staleTime: 1000 * 60 * 5,
  });
}
