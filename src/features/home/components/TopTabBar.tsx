import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopTabBarProps {
  activeIndex: number;
  onTabPress: (index: number) => void;
  onSearchPress: () => void;
}

const tabs = ['My Bets', 'Watch List', 'Markets'];

export const TopTabBar = ({ activeIndex, onTabPress, onSearchPress }: TopTabBarProps) => (
  <View style={styles.container}>
    <View style={styles.spacer} />
    <View style={styles.tabs}>
      {tabs.map((label, index) => (
        <Pressable key={label} onPress={() => onTabPress(index)}>
          <Text style={activeIndex === index ? styles.active : styles.dimmed}>{label}</Text>
        </Pressable>
      ))}
    </View>
    <Pressable onPress={onSearchPress} style={styles.searchBtn}>
      <Ionicons name="search" size={20} color="#fff" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 40,
  },
  searchBtn: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    flex: 1,
  },
  active: {
    color: '#fff',
    fontWeight: '800',
  },
  dimmed: {
    color: '#bbb',
    fontWeight: '600',
  },
});
