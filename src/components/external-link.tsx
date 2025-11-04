import { Linking, Pressable, Text, type TextProps } from 'react-native';

type ExternalLinkProps = TextProps & { href: string };

export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <Pressable onPress={() => Linking.openURL(String(href))}>
      <Text {...rest}>{children}</Text>
    </Pressable>
  );
}
