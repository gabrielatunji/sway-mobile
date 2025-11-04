import { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'Home' | 'Friends' | 'Create' | 'Inbox' | 'Profile';

interface SwayBottomTabsProps {
  activeTab?: TabKey;
  onTabChange?: (tab: TabKey) => void;
}

function SwayBottomTabsComponent({ activeTab = 'Home', onTabChange }: SwayBottomTabsProps) {
  const insets = useSafeAreaInsets();
  const [internalActive, setInternalActive] = useState<TabKey>(activeTab);

  const handleTabPress = (tab: TabKey) => {
    setInternalActive(tab);
    onTabChange?.(tab);
  };

  const current = onTabChange ? activeTab : internalActive;

  return (
    <View
      className="absolute left-0 right-0 bg-black flex-row justify-around items-center"
      style={{ bottom: 0, paddingBottom: insets.bottom, height: 60 + insets.bottom }}
    >
      <Pressable onPress={() => handleTabPress('Home')} className="items-center">
        <Text className={`text-2xl ${current === 'Home' ? 'text-white' : 'text-white/40'}`}>🏠</Text>
        <Text className={`text-[11px] mt-1 ${current === 'Home' ? 'text-white' : 'text-white/40'}`}>Home</Text>
      </Pressable>

      <Pressable onPress={() => handleTabPress('Friends')} className="items-center">
        <Text className={`text-2xl ${current === 'Friends' ? 'text-white' : 'text-white/40'}`}>👥</Text>
        <Text className={`text-[11px] mt-1 ${current === 'Friends' ? 'text-white' : 'text-white/40'}`}>Friends</Text>
      </Pressable>

      <Pressable onPress={() => handleTabPress('Create')} className="items-center -mt-8">
        <View className="w-14 h-14 bg-white rounded-xl items-center justify-center shadow-lg shadow-black/40">
          <Text className="text-black text-3xl">+</Text>
        </View>
      </Pressable>

      <Pressable onPress={() => handleTabPress('Inbox')} className="items-center">
        <View>
          <Text className={`text-2xl ${current === 'Inbox' ? 'text-white' : 'text-white/40'}`}>💬</Text>
          <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FE2C55] items-center justify-center">
            <Text className="text-white text-[10px] font-semibold">4</Text>
          </View>
        </View>
        <Text className={`text-[11px] mt-1 ${current === 'Inbox' ? 'text-white' : 'text-white/40'}`}>Inbox</Text>
      </Pressable>

      <Pressable onPress={() => handleTabPress('Profile')} className="items-center">
        <Text className={`text-2xl ${current === 'Profile' ? 'text-white' : 'text-white/40'}`}>👤</Text>
        <Text className={`text-[11px] mt-1 ${current === 'Profile' ? 'text-white' : 'text-white/40'}`}>Profile</Text>
      </Pressable>
    </View>
  );
}

const SwayBottomTabs = memo(SwayBottomTabsComponent);
export default SwayBottomTabs;
