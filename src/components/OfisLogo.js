import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const OfisLogo = ({ scale = 1 }) => {
  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      {/* Top Banner: OFS */}
      <View style={styles.row}>
        <Text style={styles.letterText}>O</Text>
        <Text style={styles.letterText}>F</Text>
        <View>
            <Text style={styles.letterText}>S</Text>
            {/* Orange Corner Accent on 'S' (Top Right) */}
            <View style={[styles.cornerAccent, styles.accentTopRight]} />
        </View>
      </View>
      
      {/* Bottom Banner: SQUARE */}
      <View style={[styles.row, { marginTop: -8 }]}>
        <Text style={styles.smallLetterText}>S</Text>
        <Text style={styles.smallLetterText}>Q</Text>
        <Text style={styles.smallLetterText}>U</Text>
        <Text style={styles.smallLetterText}>A</Text>
        <Text style={styles.smallLetterText}>R</Text>
        <Text style={styles.smallLetterText}>E</Text>
        {/* Orange Corner Accent on 'Q' (Bottom Left) */}
        {/* We place it absolutely relative to the row container */}
        <View style={[styles.cornerAccent, styles.accentBottomLeft]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  letterText: {
    fontFamily: 'System',
    fontWeight: '300', // Thin wireframe look
    fontSize: 56,
    color: 'transparent',
    WebkitTextStrokeWidth: 1, // Only works on web/some RN versions. We will use solid white with thin weight to simulate wireframe if stroke doesn't perfectly render
    borderWidth: 0,
    textShadowColor: COLORS.white,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
    letterSpacing: 4,
    color: COLORS.white, // Fallback to solid white for safety
  },
  smallLetterText: {
    fontFamily: 'System',
    fontWeight: '300',
    fontSize: 28,
    color: 'transparent',
    textShadowColor: COLORS.white,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
    letterSpacing: 2,
    color: COLORS.white,
  },
  cornerAccent: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  accentTopRight: {
    top: 6,
    right: -2,
    borderTopWidth: 0,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: '#FF8A00', // Orange triangle
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '180deg'}]
  },
  accentBottomLeft: {
    bottom: 2,
    left: 42, // precise placement under 'Q'
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: '#FF8A00',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '180deg'}]
  }
});

export default OfisLogo;
