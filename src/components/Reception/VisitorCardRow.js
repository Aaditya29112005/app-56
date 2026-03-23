import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity } from 'react-native';
import { Eye, CheckCircle, UserCheck } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import Badge from '../Badge';

const VisitorCardRow = ({ visitor, onRowPress, onCheckIn, onApprove, onViewDetails }) => {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const isPending = visitor.status === 'pending';

  return (
    <Pressable
      onPress={() => onRowPress(visitor)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1A1A1A' : colors.surfaceElevated,
          borderColor: isDark ? colors.border : 'transparent',
          borderWidth: isDark ? 1 : 0,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        
        {/* Left Side: Name and Email */}
        <View style={styles.leftCol}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {visitor.name}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
            {visitor.email}
          </Text>
        </View>

        {/* Middle Col: Host */}
        <View style={styles.midCol}>
          <Text style={[styles.hostLabel, { color: colors.textMuted }]}>Host</Text>
          <Text style={[styles.hostName, { color: colors.text }]} numberOfLines={1}>
            {visitor.host}
          </Text>
        </View>

        {/* Right Col: Badges & Actions */}
        <View style={styles.rightCol}>
          <View style={styles.badgeDateWrap}>
             <Badge type="reception" variant={visitor.status} />
             <Text style={[styles.dateText, { color: colors.textMuted }]}>{visitor.visitDate}</Text>
          </View>
          
          <View style={styles.actionRow}>
            {isPending && (
              <TouchableOpacity onPress={() => onApprove(visitor)} style={[styles.iconBtn, { backgroundColor: `${colors.primary}15` }]}>
                 <CheckCircle size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
            {/* Always show check in or maybe conditionally based on approval. Assuming always for now per UI spec */}
            <TouchableOpacity onPress={() => onCheckIn(visitor)} style={[styles.iconBtn, { backgroundColor: `${colors.success}15` }]}>
               <UserCheck size={16} color={colors.success} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => onViewDetails(visitor)} style={[styles.iconBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}>
               <Eye size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  leftCol: {
    flex: 2,
    paddingRight: SPACING.sm,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    marginBottom: 4,
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
  },
  midCol: {
    flex: 1.5,
    paddingHorizontal: SPACING.sm,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#333', // Subtle separator assuming dark mode default
    justifyContent: 'center',
  },
  hostLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  hostName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  rightCol: {
    flex: 2,
    alignItems: 'flex-end',
    paddingLeft: SPACING.sm,
  },
  badgeDateWrap: {
    alignItems: 'flex-end',
    marginBottom: SPACING.sm,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default VisitorCardRow;
