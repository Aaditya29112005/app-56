import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import ActionButtons from './ActionButtons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const MeetingRoomRow = ({ booking, onAction }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.98);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const statusColors = {
    BOOKED: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
    COMPLETED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' },
    ONGOING: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  };

  const currentStatus = statusColors[booking.status] || statusColors.BOOKED;

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.container}
      >
        {/* Room Info */}
        <View style={styles.section}>
          <Text style={styles.roomName}>{booking.roomName}</Text>
          <Text style={styles.capacity}>Capacity: {booking.capacity}</Text>
        </View>

        {/* Member */}
        <View style={styles.section}>
          <Text style={styles.memberName}>{booking.memberName}</Text>
          <Text style={styles.location}>{booking.memberLocation}</Text>
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.timeText}>{booking.startTime}</Text>
          <Text style={styles.label}>at</Text>
          <Text style={styles.timeText}>{booking.endTime.split('at')[1] || booking.endTime}</Text>
        </View>

        {/* Status Badge (Vertical) */}
        <View style={[styles.statusBadge, { backgroundColor: currentStatus.bg }]}>
          {booking.status.split('').map((char, i) => (
            <Text key={i} style={[styles.statusChar, { color: currentStatus.text }]}>{char.toUpperCase()}</Text>
          ))}
        </View>

        {/* Invoice */}
        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceStatus}>{booking.invoiceStatus}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
           <ActionButtons onAction={(type) => onAction(type, booking)} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1C1F',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2E33',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  section: {
    flex: 1.5,
    paddingRight: 10,
  },
  roomName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  capacity: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
  },
  memberName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  location: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
  },
  timeText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#FFF',
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: '#64748B',
    marginVertical: 2,
  },
  statusBadge: {
    width: 24,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  statusChar: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    lineHeight: 11,
  },
  invoiceSection: {
    flex: 1,
    alignItems: 'center',
  },
  invoiceStatus: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#64748B',
  },
  actions: {
    flex: 2,
  }
});

export default MeetingRoomRow;
