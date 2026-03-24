import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BORDER_RADIUS, SHADOWS } from '../theme/spacing';

const GlassCard = ({ children, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.glassContainer,
      { 
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 10
      },
      style
    ]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  content: {
    padding: 24,
  },
});

export default GlassCard;
