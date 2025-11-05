// Mock comments data
export const mockComments = [
  { id: '1', author: 'TraderJoe', text: 'This is looking very bullish!', time: '2h ago' },
  { id: '2', author: 'MarketWatch', text: 'I think the momentum will shift soon', time: '5h ago' },
  { id: '3', author: 'CryptoKing', text: 'Great opportunity here', time: '1d ago' },
  { id: '4', author: 'BetMaster', text: 'Not convinced by these odds', time: '2d ago' },
];

export type Comment = {
  id: string;
  author: string;
  text: string;
  time: string;
};
