import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Users, MapPin, Layers } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import CabinStatusBadge from './CabinStatusBadge';
import Haptics from '../../utils/Haptics';

const CabinCard = ({ cabin, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
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
            <Text style={styles.cabinNo}>{cabin.cabinNo}</Text>
            <View style={styles.typeRow}>
               <Layers size={12} color="#64748B" />
               <Text style={styles.typeText}>{cabin.type} • Floor {cabin.floor}</Text>
            </View>
          </View>
          <CabinStatusBadge status={cabin.status} />
        </View>

        <View style={styles.body}>
           <View style={styles.metaItem}>
             <Building2 size={14} color="#F59E0B" />
             <Text style={styles.metaText}>{cabin.building}</Text>
           </View>
           <View style={styles.metaItem}>
             <Users size={14} color="#64748B" />
             <Text style={styles.metaText}>{cabin.capacity} people</Text>
           </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.allocationLabel}>ALLOCATED TO</Text>
           <Text style={[styles.allocatedTo, !cabin.allocatedTo && { color: '#64748B', fontStyle: 'italic' }]}>
             {cabin.allocatedTo || 'Not Allocated'}
           </Text>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  content: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cabinNo: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF', marginBottom: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontFamily: FONTS.medium, fontSize: 13, color: '#94A3B8' },
  body: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13, color: '#F9FAFB' },
  footer: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#374151' },
  allocationLabel: { fontFamily: FONTS.bold, fontSize: 10, color: '#64748B', letterSpacing: 1, marginBottom: 6 },
  allocatedTo: { fontFamily: FONTS.bold, fontSize: 14, color: '#F59E0B' },
});

export default CabinCard;
