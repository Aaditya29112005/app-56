import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Layers, Cpu, MoreVertical, Edit2, Trash2, Power } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import CommonAreaStatusBadge from './CommonAreaStatusBadge';
import Haptics from '../../utils/Haptics';

const CommonAreaCard = ({ area, onEdit, onDelete, onToggleStatus }) => {
  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
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
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.areaInfo}>
            <Text style={styles.name}>{area.name}</Text>
            <View style={styles.typeRow}>
               <Layers size={12} color="#64748B" />
               <Text style={styles.typeText}>{area.type}</Text>
            </View>
          </View>
          <CommonAreaStatusBadge status={area.status} />
        </View>

        <View style={styles.body}>
           <View style={styles.metaItem}>
             <Building2 size={14} color="#F97316" />
             <Text style={styles.metaText}>{area.building}</Text>
           </View>
           <View style={styles.metaItem}>
             <Cpu size={14} color="#64748B" />
             <Text style={styles.metaText}>{area.devices?.length || 0} Devices</Text>
           </View>
        </View>

        <View style={styles.footer}>
           <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(area)}>
              <Edit2 size={16} color="#94A3B8" />
              <Text style={styles.actionText}>Edit</Text>
           </TouchableOpacity>
           <View style={styles.divider} />
           <TouchableOpacity style={styles.actionBtn} onPress={() => onToggleStatus(area.id)}>
              <Power size={16} color={area.status === 'ACTIVE' ? '#F97316' : '#94A3B8'} />
              <Text style={styles.actionText}>Status</Text>
           </TouchableOpacity>
           <View style={styles.divider} />
           <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(area.id)}>
              <Trash2 size={16} color="#EF4444" />
              <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
           </TouchableOpacity>
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
  name: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF', marginBottom: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontFamily: FONTS.medium, fontSize: 13, color: '#94A3B8' },
  body: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13, color: '#F9FAFB' },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#334155' 
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  actionText: { fontFamily: FONTS.bold, fontSize: 12, color: '#94A3B8' },
  divider: { width: 1, height: 16, backgroundColor: '#334155' },
});

export default CommonAreaCard;
