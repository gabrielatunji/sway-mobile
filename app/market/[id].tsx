import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MarketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-black p-6">
      <Text className="text-white text-xl font-bold">Market #{id}</Text>
      <Text className="text-gray-400 mt-2">Detail screen</Text>
    </View>
  );
}
