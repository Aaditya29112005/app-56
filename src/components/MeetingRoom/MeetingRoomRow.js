import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

const COLUMN_FLEX = {
  room: 2.2,
  member: 2.0,
  timing: 2.5,
  status: 1.2,
  invoice: 1.0,
  actions: 2.5
};

const MeetingRoomRow = ({ item, index, onAction }) => {
  const { colors, isDark } = useTheme();

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.row, { borderBottomColor: isDark ? '#1F2937' : colors.border }]}>
      {/* Room */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.room }]}>
        <Text style={[styles.primaryText, { color: colors.text }]}>{item.room}</Text>
        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Capacity: {item.capacity}</Text>
      </View>

      {/* Member */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.member }]}>
        <Text style={[styles.primaryText, { color: colors.text }]}>{item.member}</Text>
        <Text style={[styles.secondaryText, { color: colors.textSecondary }]} numberOfLines={1}>{item.building}</Text>
      </View>

      {/* Timing */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.timing }]}>
        <Text style={[styles.primaryText, { color: colors.text }]}>{formatTime(item.start)}</Text>
        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{formatTime(item.end)}</Text>
      </View>

      {/* Status */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.status }]}>
        <StatusBadge status={item.status} />
      </View>

      {/* Invoice */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.invoice, alignItems: 'center' }]}>
        <Text style={[styles.invoiceText, { color: colors.textSecondary }]}>{item.invoiceStatus}</Text>
      </View>

      {/* Actions */}
      <View style={[styles.cell, { flex: COLUMN_FLEX.actions }]}>
        <ActionButtons booking={item} onAction={onAction} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  primaryText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  secondaryText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 2,
  },
  invoiceText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    textTransform: 'capitalize',
  },
});

export default MeetingRoomRow;
