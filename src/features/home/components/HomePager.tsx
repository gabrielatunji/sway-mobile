import { forwardRef, Children, type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

interface HomePagerProps extends ScrollViewProps {
  width: number;
  height: number;
  children: ReactNode;
}

export const HomePager = forwardRef<ScrollView, HomePagerProps>(
  ({ width, height, children, ...rest }, ref) => (
    <ScrollView
      ref={ref}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      {...rest}
    >
      {Children.map(children, (child, index) => (
        <View key={index} style={{ width, height }}>
          {child}
        </View>
      ))}
    </ScrollView>
  ),
);

HomePager.displayName = 'HomePager';
