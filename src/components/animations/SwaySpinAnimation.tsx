import { memo, ReactNode } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SwaySpinAnimationProps {
  children: ReactNode;
  durationMs?: number;
  size?: number;
}

function SwaySpinAnimationComponent({ children, durationMs = 3000, size }: SwaySpinAnimationProps) {
  const rotation = useSharedValue(0);

  rotation.value = withRepeat(
    withTiming(360, { duration: durationMs, easing: Easing.linear }),
    -1,
    false,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    width: size,
    height: size,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

const SwaySpinAnimation = memo(SwaySpinAnimationComponent);
export default SwaySpinAnimation;
