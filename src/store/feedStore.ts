import { create } from 'zustand';

export type FeedState = {
  currentIndex: number;
  setIndex: (i: number) => void;
};

export const useFeedStore = create<FeedState>((set) => ({
  currentIndex: 0,
  setIndex: (i: number) => set({ currentIndex: i }),
}));
