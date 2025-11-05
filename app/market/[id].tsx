import { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockMarkets } from '../../src/mocks/mockMarkets';
import { generateMockChartData } from '../../src/mocks/mockChartData';
import { mockComments } from '../../src/mocks/mockComments';

const MARKET_LOGOS: Record<string, any> = {
  polymarket: require('../../src/mocks/mockAssets/polymarket.png'),
  manifold: require('../../src/mocks/mockAssets/manifold.png'),
  kalshi: require('../../src/mocks/mockAssets/kalshi.png'),
};

export default function MarketDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);

  // Find the market by id
  const market = mockMarkets.find((m) => m.id === id);

  if (!market) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Market not found</Text>
      </SafeAreaView>
    );
  }

  const marketLogoUri = MARKET_LOGOS[market.source];
  const options = market.options || [
    { label: 'Yes', value: market.prices?.yes },
    { label: 'No', value: market.prices?.no },
  ];

  const chartData = generateMockChartData(options);
  const formatPrice = (value: number) => `${value.toFixed(1)}¢`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </Pressable>
        <Image source={marketLogoUri} style={styles.marketLogo} />
        <Pressable style={styles.shareBtn}>
          <Ionicons name="share-social" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Headline */}
        <Text style={styles.headline}>{market.headline}</Text>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartLegend}>
            {chartData.map((series, idx) => (
              <View key={idx} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: series.color }]} />
                <Text style={styles.legendText}>
                  {series.label} {options[idx]?.value !== undefined ? formatPrice(options[idx].value!) : ''}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chart}>
            {/* Simple mock chart visualization */}
            <View style={styles.chartLines}>
              {chartData.map((series, idx) => (
                <View key={idx} style={[styles.chartLine, { backgroundColor: series.color, opacity: 0.3, height: 2 }]} />
              ))}
            </View>
            <Text style={styles.chartPlaceholder}>📈 Interactive Chart</Text>
            <Text style={styles.chartSubtext}>Tap and drag to scrub through time</Text>
          </View>
        </View>

        {/* Buy Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Place Your Bet</Text>
          <View style={styles.optionsRow}>
            {options.map((opt, idx) => {
              let bgColor = '#22c55e';
              if (idx === 1) bgColor = '#dc2626';
              else if (idx > 1) bgColor = `hsl(${idx * 60}, 70%, 50%)`;
              
              return (
                <Pressable
                  key={idx}
                  style={[styles.optionBtn, { backgroundColor: bgColor }]}
                  onPress={() => console.log(`Buy ${opt.label}`)}
                >
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  <Text style={styles.optionPrice}>{opt.value !== undefined ? formatPrice(opt.value) : ''}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments ({mockComments.length})</Text>
          {mockComments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentMeta}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    padding: 4,
  },
  marketLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  shareBtn: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  headline: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  chartContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  chart: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chartLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    padding: 24,
  },
  chartLine: {
    width: '100%',
  },
  chartPlaceholder: {
    fontSize: 32,
    marginBottom: 8,
  },
  chartSubtext: {
    color: '#888',
    fontSize: 14,
  },
  optionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  optionPrice: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  commentCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  commentTime: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  commentText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 21,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
