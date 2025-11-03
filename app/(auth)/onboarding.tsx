import { View, Text, Pressable } from 'react-native';
import { Link, type Href } from 'expo-router';

export default function Onboarding() {
  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-4">Sway</Text>
      <Text className="text-gray-400 text-center mb-10">
        Swipe prediction markets. Bet, follow, and win.
      </Text>
      <Link href={'/(auth)/auth-selection' as Href} asChild>
        <Pressable className="bg-white/10 px-6 py-4 rounded-2xl">
          <Text className="text-white font-semibold">Get started</Text>
        </Pressable>
      </Link>
    </View>
  );
}
