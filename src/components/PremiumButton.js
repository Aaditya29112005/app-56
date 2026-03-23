import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { BORDER_RADIUS, SPACING } from '../theme/spacing';
import Haptics from '../utils/Haptics';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PremiumButton = ({ title, onPress, style, type = 'primary', isLoading = false, disabled = false }) => {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
      opacity: withTiming(pressed.value || isLoading || disabled ? 0.6 : 1, { duration: 150 }),
    };
  });

  const handlePressIn = useCallback(() => {
    if (isLoading || disabled) return;
    scale.value = 0.97;
    pressed.value = 1;
  }, [isLoading]);

  const handlePressOut = useCallback(() => {
    if (isLoading || disabled) return;
    scale.value = 1;
    pressed.value = 0;
  }, [isLoading, disabled]);

  const handlePress = () => {
      if (isLoading || disabled) return;
      Haptics.impactMedium();
      if (onPress) onPress();
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading || disabled}
      style={[
        styles.button,
        type === 'primary' ? styles.primary : styles.secondary,
        reanimatedStyle,
        style
      ]}
    >
      {isLoading ? (
          <ActivityIndicator color={type === 'primary' ? COLORS.white : COLORS.primary} />
      ) : (
          <Text style={[
            styles.text,
            type === 'primary' ? styles.primaryText : styles.secondaryText
          ]}>
            {title}
          </Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 14, // Refined
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  primary: {
    backgroundColor: '#FF8A00', // Explicit Elite Orange
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: '#2A2A2A',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
});

export default PremiumButton;
