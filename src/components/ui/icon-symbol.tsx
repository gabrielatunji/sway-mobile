import { Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolProps = TextProps & {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function IconSymbol({ name, size = 24, color = '#000', style, ...rest }: IconSymbolProps) {
  return (
    <Text {...rest} style={[{ fontSize: size, color }, style]}>
      {name}
    </Text>
  );
}
