import { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SwayFeedTab = 'STEM' | 'Explore' | 'Following' | 'For You';

const TABS: SwayFeedTab[] = ['STEM', 'Explore', 'Following', 'For You'];

interface SwayTopNavigationProps {
  activeTab: SwayFeedTab;
  onTabChange: (tab: SwayFeedTab) => void;
}

function SwayTopNavigationComponent({ activeTab, onTabChange }: SwayTopNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50 bg-black/40"
      style={{ paddingTop: insets.top, height: insets.top + 80 }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="px-3 py-1 rounded-full border border-white/40">
          <Text className="text-white text-xs font-semibold">LIVE</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', columnGap: 16 }}
          className="flex-1 mx-4"
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
              onPress={() => onTabChange(tab)}
              className="items-center"
            >
              <Text
                className={
                  activeTab === tab
                    ? 'text-white text-base font-semibold'
                    : 'text-white/70 text-base'
                }
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="h-0.5 w-10 bg-white rounded-full mt-1" />
              )}
            </Pressable>
          ))}
        </ScrollView>

        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
          <Text className="text-white text-xl">🔍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const SwayTopNavigation = memo(SwayTopNavigationComponent);
export default SwayTopNavigation;
