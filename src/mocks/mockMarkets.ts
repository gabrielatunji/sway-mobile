// mockMarkets.ts

// Type for a market option
export type MarketOption = {
  label: string;
  value: number;
};

// Type for a market
export type MockMarket = {
  id: string;
  headline: string;
  source: 'polymarket' | 'kalshi' | 'manifold';
  prices?: { yes: number; no: number };
  options?: MarketOption[];
  image: any;
};

export const mockMarkets: MockMarket[] = [
  {
    id: '1',
    headline: 'Will Bitcoin hit $100k by 2026?',
    source: 'polymarket',
    prices: { yes: 45.2, no: 54.8 },
    image: require('./mockAssets/mock1.jpg'),
  },
  {
    id: '2',
    headline: 'Will AI pass the Turing Test by 2030?',
    source: 'kalshi',
    prices: { yes: 12.3, no: 87.7 },
    image: require('./mockAssets/mock2.jpg'),
  },
  {
    id: '3',
    headline: 'Will SpaceX land humans on Mars by 2035?',
    source: 'manifold',
    prices: { yes: 33.3, no: 66.7 },
    image: require('./mockAssets/mock3.jpg'),
  },
  // Dynamic options test
  {
    id: '4',
    headline: 'Who will win the 2028 US Presidential Election?',
    source: 'manifold',
    options: [
      { label: 'Andrew Cuomo', value: 40.1 },
      { label: 'Zohra Madmani', value: 35.7 },
      { label: 'Casey Sulia', value: 24.2 },
      { label: 'June Canola', value: 10.5 },
      { label: 'April Blue', value: 8.3 },
    ],
    image: require('./mockAssets/mock1.jpg'),
  },
  {
    id: '5',
    headline: 'Will Ethereum switch to Proof of Stake by 2027?',
    source: 'kalshi',
    options: [
      { label: 'Yes', value: 60.5 },
      { label: 'No', value: 39.5 },
    ],
    image: require('./mockAssets/mock2.jpg'),
  },
];

// Usage:
// import { mockMarkets } from '../mocks/mockMarkets';
// Use mockMarkets in your feed component to render swipeable cards with images.
