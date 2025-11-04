import { memo, useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SwaySpinningDiscProps {
  imageUrl: string;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

function SwaySpinningDiscComponent({ imageUrl }: SwaySpinningDiscProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!imageUrl) {
    return (
      <View className="mt-6">
        <Animated.View
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#fff',
              backgroundColor: '#1f1f1f',
            },
            animatedStyle,
          ]}
        />
      </View>
    );
  }

  return (
    <View className="mt-6">
      <AnimatedImage
        source={{ uri: imageUrl }}
        style={[{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' }, animatedStyle]}
      />
    </View>
  );
}

const SwaySpinningDisc = memo(SwaySpinningDiscComponent);
export default SwaySpinningDisc;
