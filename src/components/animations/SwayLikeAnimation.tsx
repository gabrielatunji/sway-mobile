import { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

interface SwayLikeAnimationProps {
  trigger: number;
  size?: number;
  color?: string;
}

function SwayLikeAnimationComponent({ trigger, size = 96, color = '#FE2C55' }: SwayLikeAnimationProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(withSpring(1.4), withSpring(1));
  }, [trigger, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      <Animated.Text style={[{ fontSize: size, color }, animatedStyle]}>❤️</Animated.Text>
    </View>
  );
}

const SwayLikeAnimation = memo(SwayLikeAnimationComponent);
export default SwayLikeAnimation;
