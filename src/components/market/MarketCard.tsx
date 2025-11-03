import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { memo, useMemo } from 'react';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type Market = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  creator?: string;
  creatorAvatar?: string;
  source?: string;
  odds?: { yes: number; no: number };
  volume?: number;
  endDate?: string;
  isLiked?: boolean;
  likes?: number;
  isBookmarked?: boolean;
  bookmarks?: number;
};

export const MarketCard = memo(function MarketCard({
  market,
  isActive,
}: {
  market: Market;
  isActive: boolean;
}) {
  const yes = market?.odds?.yes ?? 0;
  const no = market?.odds?.no ?? 0;
  const bg = useMemo(() => ({ uri: market.thumbnailUrl }), [market.thumbnailUrl]);
  const router = useRouter();

  return (
    <View style={{ height: SCREEN_HEIGHT }} className="bg-black">
      {!!market.thumbnailUrl && (
        <Image
          source={bg}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }}
          blurRadius={20}
        />
      )}
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} className="bg-black/40" />

      <View className="flex-1 justify-end p-4 pb-24">
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            {market.creatorAvatar ? (
              <Image source={{ uri: market.creatorAvatar }} style={{ width: 40, height: 40, borderRadius: 999, marginRight: 8 }} />
            ) : null}
            <Text className="text-white font-semibold">{market.creator ?? 'Creator'}</Text>
            <Text className="text-gray-400 ml-2">• {market.source ?? 'Source'}</Text>
          </View>

          <Text className="text-white text-xl font-bold mb-2">{market.title}</Text>

          <View className="flex-row items-center">
            <View className="bg-white/10 px-4 py-2 rounded-full mr-2">
              <Text className="text-white font-bold">YES {yes}%</Text>
            </View>
            <View className="bg-white/10 px-4 py-2 rounded-full">
              <Text className="text-white font-bold">NO {no}%</Text>
            </View>
          </View>

          <Text className="text-gray-400 text-sm mt-2">
            ${Number(market.volume ?? 0).toLocaleString()} volume • {market.endDate ?? 'TBA'}
          </Text>
        </View>
      </View>

      <View style={{ position: 'absolute', right: 16, bottom: 128 }}>
        <Pressable onPress={() => router.push(`/market/${market.id}` as Href)} className="bg-purple-600 w-14 h-14 rounded-full items-center justify-center">
          <Text className="text-white text-2xl">💰</Text>
        </Pressable>
      </View>
    </View>
  );
});