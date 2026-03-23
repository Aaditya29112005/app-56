import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Users, MapPin, Layers } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';
import CabinStatusBadge from './CabinStatusBadge';
import Haptics from '../../utils/Haptics';

const CabinCard = ({ cabin, onPress }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
            Haptics.impactLight();
            onPress(cabin);
        }}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.cabinInfo}>
            <Text style={[styles.cabinNo, { color: colors.text }]}>{cabin.cabinNo}</Text>
            <View style={styles.typeRow}>
               <Layers size={12} color={colors.textMuted} />
               <Text style={[styles.typeText, { color: colors.textSecondary }]}>{cabin.type} • Floor {cabin.floor}</Text>
            </View>
          </View>
          <CabinStatusBadge status={cabin.status} />
        </View>

        <View style={styles.body}>
           <View style={styles.metaItem}>
             <Building2 size={14} color="#F59E0B" />
              <Text style={[styles.metaText, { color: colors.text }]}>{cabin.building}</Text>
           </View>
           <View style={styles.metaItem}>
              <Users size={14} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.text }]}>{cabin.capacity} people</Text>
           </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
           <Text style={[styles.allocationLabel, { color: colors.textMuted }]}>ALLOCATED TO</Text>
           <Text style={[styles.allocatedTo, !cabin.allocatedTo && { color: colors.textMuted, fontStyle: 'italic' }]}>
             {cabin.allocatedTo || 'Not Allocated'}
           </Text>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  content: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cabinNo: { fontFamily: FONTS.bold, fontSize: 18, marginBottom: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontFamily: FONTS.medium, fontSize: 13 },
  body: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13 },
  footer: { paddingTop: 16, borderTopWidth: 1 },
  allocationLabel: { fontFamily: FONTS.bold, fontSize: 10, letterSpacing: 1, marginBottom: 6 },
  allocatedTo: { fontFamily: FONTS.bold, fontSize: 14, color: '#F59E0B' },
});

export default CabinCard;
