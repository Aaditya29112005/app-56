import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  FadeInUp
} from 'react-native-reanimated';
import { MapPin, User, Clock, ChevronRight } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';

const MeetingRoomCard = ({ booking, onAction }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    opacity.value = withTiming(0.9);
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  const getStatusConfig = (status) => {
    switch (status.toUpperCase()) {
      case 'BOOKED':
        return { bg: 'rgba(255, 138, 0, 0.15)', text: '#FF8A00', label: 'Booked' };
      case 'COMPLETED':
        return { bg: 'rgba(50, 215, 75, 0.15)', text: '#32D74B', label: 'Completed' };
      default:
        return { bg: 'rgba(142, 142, 147, 0.15)', text: '#8E8E93', label: status };
    }
  };

  const status = getStatusConfig(booking.status);

  return (
    <Animated.View entering={FadeInUp.springify()}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onAction('view', booking)}
        style={styles.cardWrapper}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          {/* Left Section: Room Info */}
          <View style={styles.leftSection}>
            <Text style={styles.roomName}>{booking.roomName}</Text>
            <View style={styles.infoRow}>
              <MapPin size={12} color="#64748B" />
              <Text style={styles.locationText}>{booking.memberLocation || 'Meeting Room'}</Text>
            </View>
            <Text style={styles.capacityText}>Capacity: {booking.capacity}</Text>
          </View>

          {/* Middle Section: Member & Timing */}
          <View style={styles.middleSection}>
            <View style={styles.memberRow}>
               <User size={14} color="#FFF" />
               <Text style={styles.memberName}>{booking.memberName}</Text>
            </View>
            <Text style={styles.emailText}>Member</Text>
            <View style={styles.timingRow}>
               <Clock size={12} color="#F59E0B" />
               <Text style={styles.timingText}>{booking.startTime.split('at')[0]}</Text>
            </View>
          </View>

          {/* Right Section: Status & Action */}
          <View style={styles.rightSection}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
            </View>
            <Text style={styles.invoiceText}>{booking.invoiceStatus}</Text>
            <View style={styles.actionBtn}>
               <Text style={styles.actionBtnText}>View</Text>
               <ChevronRight size={14} color="#FFF" />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#151922',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E2430',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  leftSection: {
    flex: 1.2,
    justifyContent: 'center',
  },
  roomName: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
  },
  capacityText: {
     fontFamily: FONTS.medium,
     fontSize: 11,
     color: '#475569',
  },
  middleSection: {
    flex: 1.3,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#FFF',
  },
  emailText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timingText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#F59E0B',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  invoiceText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: '#475569',
    marginVertical: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  actionBtnText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 12,
  }
});

export default MeetingRoomCard;
