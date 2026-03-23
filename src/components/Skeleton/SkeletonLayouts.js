import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SkeletonAvatar, SkeletonText, SkeletonBox } from './SkeletonComponents';
export { SkeletonAvatar, SkeletonText, SkeletonBox };
import { useTheme } from '../../context/ThemeContext';

export const SkeletonCard = ({ style }) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      style
    ]}>
      <View style={styles.cardHeader}>
        <SkeletonAvatar size={44} />
        <View style={styles.headerText}>
          <SkeletonText width={120} height={14} spacing={6} />
          <SkeletonText width={80} height={10} />
        </View>
        <SkeletonBox width={60} height={20} borderRadius={10} />
      </View>
      <View style={styles.cardBody}>
        <SkeletonText lines={2} spacing={8} />
      </View>
      <View style={styles.cardFooter}>
        <SkeletonBox width="100%" height={36} borderRadius={8} />
      </View>
    </View>
  );
};

export const SkeletonListItem = ({ style }) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.listItem, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      style
    ]}>
      <View style={styles.listLeft}>
        <SkeletonBox width={20} height={20} borderRadius={4} />
      </View>
      <View style={styles.listCenter}>
        <SkeletonText width={120} height={14} spacing={6} />
        <SkeletonText width={180} height={10} spacing={8} />
        <SkeletonText width={100} height={12} />
      </View>
      <View style={styles.listRight}>
        <SkeletonBox width={70} height={24} borderRadius={4} />
        <SkeletonBox width={60} height={28} borderRadius={8} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
};

export const SkeletonList = ({ items = 5, style, horizontal = false }) => (
  <View style={style}>
    {Array.from({ length: items }).map((_, i) => (
      horizontal ? 
        <SkeletonListItem key={i} style={{ marginBottom: 12 }} /> :
        <SkeletonCard key={i} style={{ marginBottom: 16 }} />
    ))}
  </View>
);

export const SkeletonGrid = ({ items = 6, columns = 2, style }) => {
  const screenWidth = 400; // Rough estimate or pass as prop
  const itemWidth = (screenWidth - 48 - (columns - 1) * 16) / columns;
  
  return (
    <View style={[styles.grid, style]}>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={[styles.gridItem, { width: '47%', marginBottom: 16 }]}>
          <SkeletonBox width="100%" height={120} borderRadius={16} />
          <SkeletonText width="80%" height={12} style={{ marginTop: 10 }} />
          <SkeletonText width="50%" height={10} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
};

export const SkeletonLargeCard = ({ style }) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.largeCard, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      style
    ]}>
      <SkeletonBox width="100%" height={180} borderRadius={16} />
      <View style={styles.largeCardContent}>
        <SkeletonText width="40%" height={10} style={{ marginBottom: 10 }} />
        <SkeletonText width="85%" height={22} style={{ marginBottom: 12 }} />
        <View style={styles.infoRow}>
          <SkeletonAvatar size={16} style={{ marginRight: 8 }} />
          <SkeletonText width="40%" height={12} />
        </View>
        <View style={[styles.infoRow, { marginTop: 8 }]}>
          <SkeletonAvatar size={16} style={{ marginRight: 8 }} />
          <SkeletonText width="60%" height={12} />
        </View>
        <View style={styles.largeCardFooter}>
          <SkeletonBox width="100%" height={45} borderRadius={12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  cardBody: {
    marginBottom: 16,
  },
  cardFooter: {
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  gridItem: {
    // Width handled dynamically
  },
  largeCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  largeCardContent: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeCardFooter: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  listLeft: {
    marginRight: 16,
  },
  listCenter: {
    flex: 1,
  },
  listRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});
