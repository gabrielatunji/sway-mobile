// Mock chart data generator
export const generateMockChartData = (options: any[]) => {
  const points = 50;
  return options.map((opt, idx) => ({
    label: opt.label,
    color: idx === 0 ? '#22c55e' : idx === 1 ? '#dc2626' : `hsl(${idx * 60}, 70%, 50%)`,
    data: Array.from({ length: points }, (_, i) => ({
      x: i,
      y: Math.random() * 100,
    })),
  }));
};
