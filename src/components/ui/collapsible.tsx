import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type ViewProps } from 'react-native';

type CollapsibleProps = ViewProps & { title?: string; children?: ReactNode };

export function Collapsible({ title = 'Details', children, ...rest }: CollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <View {...rest}>
      <Pressable onPress={() => setOpen((value) => !value)}>
        <Text>
          {title} {open ? '▲' : '▼'}
        </Text>
      </Pressable>
      {open ? <View style={{ marginTop: 8 }}>{children}</View> : null}
    </View>
  );
}
