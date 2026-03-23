import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BORDER_RADIUS, SHADOWS } from '../theme/spacing';

const GlassCard = ({ children, style, level = 'medium' }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.glassContainer,
      { 
        backgroundColor: colors.surface, 
        borderColor: isDark ? colors.border : 'transparent',
        borderWidth: isDark ? 1 : 0,
        shadowColor: '#000',
        shadowOffset: isDark ? { width: 0, height: 20 } : { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.5 : 0.05,
        shadowRadius: isDark ? 30 : 10,
        elevation: isDark ? 20 : 3
      },
      style
    ]}>
      <View style={[styles.blurOverlay, { backgroundColor: colors.glassBackground }]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
  },
});

export default GlassCard;
