import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const GUESTS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const UserRowCard = ({ user, onView }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[
      styles.cardContainer, 
      { backgroundColor: GUESTS_THEME.card, borderColor: GUESTS_THEME.border, transform: [{ scale: scaleAnim }] }
    ]}>
       <View style={styles.grid}>
          
          {/* Left: Name / Email */}
          <View style={styles.colLeft}>
             <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
             <Text style={styles.subtext} numberOfLines={1}>{user.email}</Text>
          </View>

          {/* Middle: Phone / Company */}
          <View style={styles.colMiddle}>
             <Text style={styles.company} numberOfLines={1}>{user.company}</Text>
             <Text style={styles.subtext}>{user.phone || 'No phone'}</Text>
          </View>

          {/* Right: Date / Action */}
          <View style={styles.colRight}>
             <Text style={styles.date}>{formatDate(user.createdAt)}</Text>
             
             <Pressable 
               style={[styles.viewBtn, { backgroundColor: colors.primary }]}
               onPress={() => onView(user)}
               onPressIn={handlePressIn}
               onPressOut={handlePressOut}
             >
               <Text style={styles.viewBtnText}>View</Text>
             </Pressable>
          </View>

       </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colLeft: {
    flex: 2,
    paddingRight: SPACING.sm
  },
  colMiddle: {
    flex: 2,
    paddingRight: SPACING.sm
  },
  colRight: {
    flex: 1.2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 44
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFF',
    marginBottom: 4
  },
  subtext: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: GUESTS_THEME.textSecondary
  },
  company: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: '#E5E7EB',
    marginBottom: 4
  },
  date: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: GUESTS_THEME.textSecondary,
    marginBottom: 8
  },
  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full
  },
  viewBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: '#FFF'
  }
});

export default UserRowCard;
