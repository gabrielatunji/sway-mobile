import type { MarketOption } from '../../../mocks/mockMarkets';

export const buildOptionColors = (options: MarketOption[]) => {
  if (!options?.length) {
    return [] as string[];
  }

  if (options.length === 2) {
    return ['#22c55e', '#dc2626'];
  }

  const sortedByValue = [...options].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const colorForRank = (rank: number, total: number) => {
    if (rank === 0) return '#22c55e';
    if (rank === total - 1) return '#dc2626';
    const t = rank / (total - 1);
    const r = Math.round(34 + (220 - 34) * t);
    const g = Math.round(197 + (38 - 197) * t);
    const b = Math.round(94 + (38 - 94) * t);
    return `rgb(${r},${g},${b})`;
  };

  return options.map((opt) => {
    const rank = sortedByValue.findIndex(
      (candidate) => candidate.label === opt.label && candidate.value === opt.value,
    );
    return colorForRank(rank, options.length);
  });
};
