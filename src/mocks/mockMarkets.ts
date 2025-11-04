// mockMarkets.ts
// Drop images here and define mock market data for swipeable feed testing

export const mockMarkets = [
  {
    id: '1',
    headline: 'Will Bitcoin hit $100k by 2026?',
    source: 'polymarket',
    prices: { yes: 45.2, no: 54.8 },
    image: require('./mockAssets/mock1.jpg'), // Drop your image in assets/images and update the filename
  },
  {
    id: '2',
    headline: 'Will AI pass the Turing Test by 2030?',
    source: 'kalshi',
    prices: { yes: 12.3, no: 87.7 },
    image: require('./mockAssets/mock2.jpg'), // Drop your image in assets/images and update the filename
  },
  {
    id: '3',
    headline: 'Will SpaceX land humans on Mars by 2035?',
    source: 'manifold',
    prices: { yes: 33.3, no: 66.7 },
    image: require('./mockAssets/mock3.jpg'), // Drop your image in assets/images and update the filename
  },
  // Add more mock markets as needed
];

// Usage:
// import { mockMarkets } from '../mocks/mockMarkets';
// Use mockMarkets in your feed component to render swipeable cards with images.
