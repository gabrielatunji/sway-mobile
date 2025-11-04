import { Text, type TextProps } from 'react-native';

type ThemedTextProps = TextProps & { type?: string };

export function ThemedText({ type: _type, ...rest }: ThemedTextProps) {
  return <Text {...rest} />;
}
