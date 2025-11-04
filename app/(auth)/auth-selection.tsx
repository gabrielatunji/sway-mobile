import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useWallet } from '../../src/hooks/useWallet';
import { useAuthStore } from '../../src/store/authStore';
import type { AuthState } from '../../src/store/authStore';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

export default function AuthSelection() {
  const [email, setEmail] = useState('');
  const { openWalletModal, Modal } = useWallet();
  const setEmailToVerify = useAuthStore((state) => state.setEmailToVerify);
  const router = useRouter();

  const emailAuth = async () => {
    if (!email) return;
    setEmailToVerify(email);
  router.push('/(auth)/email-verification' as Href);
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Modal />
      <View className="items-center mb-12">
        <Image source={require('../../assets/images/facebooklogo.webp')} style={{ width: 128, height: 128 }} />
      </View>

      <Text className="text-white text-2xl font-bold text-center mb-2">Select your account</Text>
      <Text className="text-gray-400 text-center mb-8">Sign in with wallet or email</Text>

      <Pressable onPress={openWalletModal} className="bg-white/10 py-4 rounded-xl mb-4 items-center">
        <Text className="text-white font-semibold">Connect Wallet</Text>
      </Pressable>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-800" />
        <Text className="text-gray-500 px-4">or</Text>
        <View className="flex-1 h-px bg-gray-800" />
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-gray-900 text-white px-4 py-4 rounded-xl mb-4"
      />

      <Pressable onPress={emailAuth} className="bg-white/10 py-4 rounded-xl items-center">
        <Text className="text-white font-semibold">Continue with email</Text>
      </Pressable>
    </View>
  );
}
