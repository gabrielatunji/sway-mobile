import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MockMarket, MarketOption } from '../../../../mocks/mockMarkets';
import { mockComments } from '../../../../mocks/mockComments';
import { MARKET_LABELS, MARKET_LOGOS } from '../../constants';

interface MarketDetailProps {
  market: MockMarket;
  options: MarketOption[];
  chartData: Array<{ label: string; color: string }>;
  formatPrice: (value: number) => string;
}

export const MarketDetail = ({ market, options, chartData, formatPrice }: MarketDetailProps) => {
  const marketLogoUri = MARKET_LOGOS[market.source];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 32, paddingBottom: 120 }}
    >
      <View style={styles.header}>
        {marketLogoUri ? <Image source={marketLogoUri} style={styles.logo} /> : null}
        <Text style={styles.marketName}>{MARKET_LABELS[market.source]}</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="share-social" size={22} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.headline}>{market.headline}</Text>

      <View style={styles.chartSection}>
        <View style={styles.legend}>
          {chartData.map((series, idx) => (
            <View key={series.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: series.color }]} />
              <Text style={styles.legendText}>
                {series.label}{' '}
                {options[idx]?.value !== undefined ? formatPrice(options[idx].value) : ''}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartEmoji}>📈</Text>
          <Text style={styles.chartCaption}>Interactive Chart</Text>
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Place Your Bet</Text>
        <View style={styles.optionRow}>
          {options.map((option, idx) => {
            let backgroundColor = '#22c55e';
            if (idx === 1) backgroundColor = '#dc2626';
            if (idx > 1) backgroundColor = `hsl(${idx * 60}, 70%, 50%)`;

            return (
              <Pressable
                key={option.label}
                style={[styles.optionCard, { backgroundColor, flex: options.length === 2 ? 1 : undefined }]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionPrice}>
                  {option.value !== undefined ? formatPrice(option.value) : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>Comments ({mockComments.length})</Text>
        {mockComments.slice(0, 5).map((comment) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  marketName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  iconBtn: {
    padding: 8,
  },
  headline: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chartSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  chartPlaceholder: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chartEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartCaption: {
    color: '#888',
    fontSize: 14,
  },
  optionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  optionCard: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  optionLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  optionPrice: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 14,
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commentCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  commentTime: {
    color: '#888',
    fontSize: 12,
  },
  commentText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
});
