import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  interpolateColor,
  useSharedValue,
  interpolate,
  withSpring
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { BORDER_RADIUS, SPACING } from '../theme/spacing';
import { useTheme } from '../context/ThemeContext';

const PremiumInput = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry, 
    keyboardType, 
    onFocus, 
    onBlur, 
    error 
}) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const focusValue = useSharedValue(value ? 1 : 0);
  const scaleValue = useSharedValue(1);

  React.useEffect(() => {
    focusValue.value = withTiming(error ? 0 : (isFocused || value ? 1 : 0), { duration: 200 });
  }, [isFocused, error, value]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      borderColor: error ? '#FF3B30' : interpolateColor(
        focusValue.value,
        [0, 1],
        [colors.border, colors.primary]
      ),
      backgroundColor: error ? 'rgba(255, 59, 48, 0.05)' : interpolateColor(
        focusValue.value,
        [0, 1],
        [colors.surface, isDark ? 'rgba(255, 138, 0, 0.05)' : 'rgba(255, 138, 0, 0.1)']
      ),
      shadowColor: focusValue.value === 1 ? colors.primary : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: interpolate(
          focusValue.value,
          [0, 1],
          [isDark ? 0 : 0.03, isDark ? 0.15 : 0.08]
      ),
      shadowRadius: 10,
    };
  });

  const labelStyle = useAnimatedStyle(() => {
      return {
          transform: [
              { translateY: interpolate(focusValue.value, [0, 1], [0, -22]) },
              { translateX: interpolate(focusValue.value, [0, 1], [0, -4]) },
              { scale: interpolate(focusValue.value, [0, 1], [1, 0.85]) }
          ],
          color: focusValue.value === 1 ? colors.primary : colors.textSecondary
      };
  });

  const handleFocus = () => {
      setIsFocused(true);
      scaleValue.value = withSpring(1.01);
      if (onFocus) onFocus();
  };

  const handleBlur = () => {
      setIsFocused(false);
      scaleValue.value = withSpring(1);
      if (onBlur) onBlur();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        {label && (
            <Animated.View style={[styles.floatingLabelContainer, labelStyle]}>
                <Text style={styles.label}>{label}</Text>
            </Animated.View>
        )}
        <TextInput
          style={[styles.input, { paddingTop: label ? 16 : 0, color: colors.text }]}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {secureTextEntry && (
            <TouchableOpacity 
                style={styles.eyeBtn}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
                <Icon 
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#8A8A8A" 
                />
            </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 14, // Refined rounding
    height: 56, // Slightly taller for floating label
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  floatingLabelContainer: {
      position: 'absolute',
      left: 16,
      top: 18,
      zIndex: 1,
  },
  label: {
    color: '#8A8A8A',
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
  },
  input: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    padding: 0,
    flex: 1,
  },
  eyeBtn: {
      position: 'absolute',
      right: 16,
      height: '100%',
      justifyContent: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontFamily: FONTS.medium,
  }
});

export default PremiumInput;
