import { api } from './api';
import type { Market } from '../components/market/MarketCard';

export type FeedResponse = {
  markets: Market[];
  nextCursor: number | null;
};

export const feedService = {
  async getFeed(type: 'forYou' | 'following', cursor: number): Promise<FeedResponse> {
    const res = await api.get<FeedResponse>(`/feed?type=${type}&cursor=${cursor}`);
    return res.data;
  },
};
