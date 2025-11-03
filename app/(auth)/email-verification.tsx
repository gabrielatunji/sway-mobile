import { View, Text, Pressable } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import type { AuthState } from '../../src/store/authStore';
import { Link, type Href } from 'expo-router';

export default function EmailVerification() {
  const email = useAuthStore((state: AuthState) => state.emailToVerify);
  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      <Text className="text-white text-2xl font-bold mb-2">Check your email</Text>
      <Text className="text-gray-400 text-center mb-8">
        We sent a magic link to {email || 'your inbox'}.
      </Text>
      <Link href={'/(tabs)' as Href} asChild>
        <Pressable className="bg-white/10 px-6 py-4 rounded-2xl">
          <Text className="text-white font-semibold">Continue</Text>
        </Pressable>
      </Link>
    </View>
  );
}
