import { memo } from 'react';
import { Text, View } from 'react-native';

interface SwayMarketOddsPillsProps {
  yesPercentage: number;
  noPercentage: number;
}

function clampPercentage(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function SwayMarketOddsPillsComponent({ yesPercentage, noPercentage }: SwayMarketOddsPillsProps) {
  const yes = clampPercentage(yesPercentage);
  const no = clampPercentage(noPercentage);

  return (
    <View className="flex-row justify-between mb-2" style={{ columnGap: 12 }}>
      <View
        className="flex-1 rounded-full px-5 py-3"
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }}
      >
        <Text className="text-white font-bold text-center">YES {yes}%</Text>
      </View>
      <View
        className="flex-1 rounded-full px-5 py-3"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)' }}
      >
        <Text className="text-white font-bold text-center">NO {no}%</Text>
      </View>
    </View>
  );
}

const SwayMarketOddsPills = memo(SwayMarketOddsPillsComponent);
export default SwayMarketOddsPills;
