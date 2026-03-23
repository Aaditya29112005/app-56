import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Building2, Users, MapPin, Layers, ChevronRight, HardDrive } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import MeetingStatusBadge from './MeetingStatusBadge';
import Haptics from '../../utils/Haptics';

const RoomCard = ({ room, onBook }) => {
  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const isDisabled = room.status.toLowerCase() === 'inactive';

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.content}
        disabled={isDisabled}
      >
        <View style={styles.header}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name} • {room.floor}</Text>
            <View style={styles.buildingRow}>
               <Building2 size={12} color="#94A3B8" />
               <Text style={styles.buildingText}>{room.building}</Text>
            </View>
          </View>
          <MeetingStatusBadge status={room.status} />
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Users size={14} color="#F97316" />
            <Text style={styles.metaText}>{room.capacity} Seats</Text>
          </View>
          <View style={styles.metaItem}>
             <HardDrive size={14} color="#94A3B8" />
             <Text style={styles.metaText}>₹{room.hourlyRate}/hour</Text>
          </View>
        </View>

        <View style={styles.footer}>
           <TouchableOpacity 
             style={[styles.bookBtn, isDisabled && styles.bookBtnDisabled]} 
             onPress={() => {
                Haptics.impactLight();
                onBook(room);
             }}
             disabled={isDisabled}
           >
              <Text style={styles.bookBtnText}>{isDisabled ? 'Maintenance' : 'Book Now'}</Text>
              {!isDisabled && <ChevronRight size={16} color="#FFF" />}
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
  roomName: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF', marginBottom: 4 },
  buildingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  buildingText: { fontFamily: FONTS.medium, fontSize: 13, color: '#94A3B8' },
  metaGrid: { flexDirection: 'row', gap: 24, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FONTS.bold, fontSize: 13, color: '#F9FAFB' },
  footer: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  bookBtn: { 
    height: 48, 
    backgroundColor: '#F97316', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  bookBtnDisabled: { backgroundColor: '#334155', opacity: 0.5 },
  bookBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
});

export default RoomCard;
