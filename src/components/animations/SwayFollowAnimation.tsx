import { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SwayFollowAnimationProps {
  isFollowing: boolean;
}

function SwayFollowAnimationComponent({ isFollowing }: SwayFollowAnimationProps) {
  const progress = useSharedValue(isFollowing ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFollowing ? 1 : 0, { duration: 200 });
  }, [isFollowing, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#FE2C55', '#3F3F46']),
  }));

  return (
    <Animated.View className="w-6 h-6 rounded-full items-center justify-center" style={animatedStyle}>
      <Text className="text-white text-xs">{isFollowing ? '✓' : '+'}</Text>
    </Animated.View>
  );
}

const SwayFollowAnimation = memo(SwayFollowAnimationComponent);
export default SwayFollowAnimation;
