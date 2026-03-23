import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  FadeInDown,
  FadeInRight,
  Layout
} from 'react-native-reanimated';
import { Menu, ArrowUp } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../context/ThemeContext';
import { formatLiveDate } from '../utils/dateUtils';
import Haptics from '../utils/Haptics';

const AnimatedNumber = ({ value, style }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withDelay(500, withTiming(value, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    }));
    
    // Fallback for visual counting if we don't have ReText
    const interval = setInterval(() => {
      const current = Math.floor(count.value);
      setDisplayValue(`₹${current.toLocaleString('en-IN')}`);
      if (current >= value) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, [value]);

  return <Text style={style}>{displayValue}</Text>;
};

const AnimatedBar = ({ height, label, isHighlighted, delay }) => {
  const { colors, isDark } = useTheme();
  const animatedHeight = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    animatedHeight.value = withDelay(
      delay,
      withTiming(height, {
        duration: 1200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    if (isHighlighted) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [height, delay, isHighlighted]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.barContainer}>
      <Animated.View 
        style={[
          styles.mainBar, 
          { backgroundColor: isHighlighted ? '#FF8A00' : (isDark ? '#2C2C2E' : '#E5E5EA') },
          isHighlighted && styles.highlightedBarGlow,
          animatedStyle
        ]} 
      />
      <Text style={[styles.graphLabel, { color: isHighlighted ? '#FF8A00' : colors.textMuted }]}>{label}</Text>
    </View>
  );
};

const StatCard = ({ title, value, subValue, trend, trendColor, iconName, color, data, isLoading, delay = 0 }) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (isLoading) return <Skeleton width="48%" height={150} borderRadius={20} />;

  const numericValue = parseInt(value, 10);
  const isPercentage = value.includes('%');

  return (
    <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => Haptics.impactLight()}
        style={styles.statCardWrapper}
    >
        <Animated.View style={[styles.statCardInner, animatedStyle]}>
            <GlassCard style={styles.statCard}>
                <View style={styles.statHeaderRow}>
                    <View style={styles.statInfoLeft}>
                        <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
                            <Icon name={iconName} size={14} color={color} />
                            <View style={[styles.iconGlow, { backgroundColor: color }]} />
                        </View>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>{title}</Text>
                    </View>
                    <View style={[styles.statTrendPill, { backgroundColor: trendColor + '15' }]}>
                        <Text style={[styles.statTrendVal, { color: trendColor }]}>{trend}</Text>
                    </View>
                </View>
                
                <View style={styles.statValueRow}>
                    {!isNaN(numericValue) ? (
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <AnimatedNumber value={numericValue} style={[styles.statHeroValue, { color: colors.text }]} />
                            {isPercentage && <Text style={[styles.statHeroValue, { color: colors.text, fontSize: 18 }]}>%</Text>}
                        </View>
                    ) : (
                        <Text style={[styles.statHeroValue, { color: colors.text }]}>{value}</Text>
                    )}
                </View>
                
                <Text style={[styles.statHeroSub, { color: colors.textMuted }]}>{subValue}</Text>

                <View style={styles.miniGraphRow}>
                    {data.map((h, i) => (
                      <MiniBar 
                        key={i} 
                        height={h} 
                        color={i === data.length - 1 ? color : (isDark ? '#3A3A3C' : '#E5E5EA')} 
                        delay={delay + 400 + (i * 40)}
                      />
                    ))}
                </View>
            </GlassCard>
        </Animated.View>
    </TouchableOpacity>
  );
};

const MiniBar = ({ height, color, delay }) => {
    const animatedHeight = useSharedValue(0);
    useEffect(() => {
        animatedHeight.value = withDelay(delay, withSpring(height, { damping: 12, stiffness: 100 }));
    }, [height]);
    const style = useAnimatedStyle(() => ({ height: animatedHeight.value }));
    return <Animated.View style={[styles.miniBarPoint, { backgroundColor: color }, style]} />;
};

const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const revenueData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 60 },
    { label: 'Mar', value: 50 },
    { label: 'Apr', value: 75 },
    { label: 'May', value: 65 },
    { label: 'Jun', value: 90 },
    { label: 'Jul', value: 70 },
    { label: 'Aug', value: 130 },
    { label: 'Sep', value: 100 },
  ];

  const avatarScale = useSharedValue(1);
  const headerFloat = useSharedValue(0);

  useEffect(() => {
    headerFloat.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const headerFloatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerFloat.value }]
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }]
  }));

  return (
    <DashboardLayout activeTab="Dashboard">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        style={styles.container}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.topSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactLight();
                navigation.openDrawer();
              }}
              style={styles.menuBtn}
            >
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.pageTitle, { color: colors.text }]}>Executive Insight</Text>
              <Animated.Text style={[styles.pageSubtitle, { color: colors.textSecondary }, headerFloatingStyle]}>
                {formatLiveDate()}  •  Ofis Square
              </Animated.Text>
            </View>
          </View>
          <TouchableOpacity 
            activeOpacity={1} 
            onPressIn={() => (avatarScale.value = withSpring(0.92))}
            onPressOut={() => (avatarScale.value = withSpring(1))}
            onPress={() => Haptics.selection()}
          >
            <Animated.View style={[styles.avatarBorder, { borderColor: colors.border }, avatarAnimatedStyle]}>
                <View style={styles.avatarCore}>
                    <Text style={styles.avatarText}>N</Text>
                </View>
                <View style={styles.avatarActiveGlow} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {isLoading ? (
          <View>
            <Skeleton width="100%" height={300} borderRadius={20} style={{ marginBottom: 12 }} />
            <View style={styles.statsGrid}>
              <Skeleton width="48%" height={150} borderRadius={20} />
              <Skeleton width="48%" height={150} borderRadius={20} />
            </View>
          </View>
        ) : (
          <React.Fragment>
            <Animated.View entering={FadeInDown.duration(600).delay(200)} layout={Layout.springify()}>
              <GlassCard style={styles.heroRevenueCard}>
                <View style={styles.revenueTop}>
                  <View>
                    <Text style={[styles.labelMuted, { color: colors.textSecondary }]}>MONTHLY REVENUE</Text>
                    <AnimatedNumber value={1428500} style={[styles.heroDigit, { color: colors.text }]} />
                  </View>
                  <Animated.View entering={FadeInRight.duration(600).delay(800)}>
                    <View style={styles.growthBadge}>
                      <Icon name="arrow-up" size={12} color="#34C759" />
                      <Text style={styles.growthText}>+18.4%</Text>
                    </View>
                  </Animated.View>
                </View>

                <View style={styles.revenueGraph}>
                  {revenueData.map((item, i) => (
                    <AnimatedBar 
                      key={item.label}
                      height={item.value}
                      label={item.label}
                      isHighlighted={item.label === 'Aug'}
                      delay={400 + (i * 60)}
                    />
                  ))}
                </View>
              </GlassCard>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.statsGrid}>
              <StatCard 
                title="Occupancy"
                value="92%"
                subValue="24 Cabins filled"
                trend="+4.2%"
                trendColor="#34C759"
                iconName="grid-outline"
                color="#34C759"
                data={[15, 25, 20, 35, 30, 45]}
                isLoading={isLoading}
                delay={600}
              />
              <StatCard 
                title="Support"
                value="14"
                subValue="Open tickets"
                trend="-2"
                trendColor="#FF453A"
                iconName="chatbubble-outline"
                color="#FF453A"
                data={[35, 25, 40, 30, 45, 35]}
                isLoading={isLoading}
                delay={700}
              />
            </Animated.View>
          </React.Fragment>
        )}
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  profileIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  heroRevenueCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  revenueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  labelMuted: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroDigit: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginTop: 6,
    letterSpacing: -0.8,
  },
  growthBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    color: '#34C759',
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  revenueGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingHorizontal: 2,
  },
  barContainer: {
    alignItems: 'center',
    width: '9%',
  },
  mainBar: {
    width: 12,
    borderRadius: 3.5,
    marginBottom: 8,
  },
  highlightedBarGlow: {
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  graphLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCardWrapper: {
    width: '48%',
  },
  statCardInner: {
    flex: 1,
  },
  statCard: {
    padding: 16,
    borderRadius: 20,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  statTrendPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statTrendVal: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  statValueRow: {
    marginBottom: 4,
  },
  statHeroValue: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.6,
  },
  statHeroSub: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  miniGraphRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 38,
    marginTop: 18,
    gap: 5,
  },
  miniBarPoint: {
    flex: 1,
    borderRadius: 3,
  },
  topInnerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  avatarActiveGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FF8A00',
    opacity: 0.3,
  },
});

export default DashboardScreen;
