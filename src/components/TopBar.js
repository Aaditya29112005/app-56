import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import AnimatedPill from './AnimatedPill';

const TopBar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        {/* Left Section - Date, Theme, Weather */}
        <View style={styles.leftSection}>
          <AnimatedPill style={styles.datePill}>
            <Text style={styles.dateText}>18 March 2026</Text>
          </AnimatedPill>
          
          <AnimatedPill style={styles.iconBtn} onPress={toggleTheme}>
            <Icon name={isDark ? "moon-outline" : "sunny-outline"} size={16} color="#8A8A8A" />
          </AnimatedPill>
          
          <Text style={styles.weatherText}>22°C</Text>
        </View>

        <View style={styles.divider} />

        {/* Right Section - Community Badge */}
        <View style={styles.rightSection}>
          <AnimatedPill style={styles.iconBtn}>
            <Icon name="business-outline" size={16} color="#8A8A8A" />
          </AnimatedPill>
          
          <View style={styles.communityBadge}>
            <Text style={styles.communitySub}>COMMUNITY</Text>
            <Text style={styles.communityName}>Ofis Square</Text>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Consistent premium padding
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Explicit rhythm gap
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
  datePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dateText: {
    color: '#8A8A8A', // Muted premium
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  iconBtn: {
    width: 38,
    height: 38,
  },
  weatherText: {
    color: '#8A8A8A',
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginLeft: 2, // Slight breathing room from pill
  },
  divider: {
    width: 1,
    height: 16, // Extremely subtle height
    backgroundColor: '#1A1A1A',
    marginHorizontal: 12, // Equal spacing
  },
  communityBadge: {
    justifyContent: 'center',
  },
  communitySub: {
    color: '#777777',
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase', // Forced small caps mapping
  },
  communityName: {
    color: '#FFFFFF', // Pristine white
    fontSize: 14, // Lifted slightly
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
});

export default TopBar;
