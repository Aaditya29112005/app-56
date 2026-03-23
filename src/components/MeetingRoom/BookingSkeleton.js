import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SkeletonItem = () => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Animated.View style={[styles.title, animStyle]} />
        <Animated.View style={[styles.sub, animStyle]} />
      </View>
      <View style={styles.middle}>
        <Animated.View style={[styles.title, animStyle]} />
        <Animated.View style={[styles.sub, animStyle]} />
      </View>
      <View style={styles.right}>
        <Animated.View style={[styles.badge, animStyle]} />
        <Animated.View style={[styles.btn, animStyle]} />
      </View>
    </View>
  );
};

const BookingSkeleton = () => (
  <View style={styles.container}>
    {[1, 2, 3, 4].map((i) => <SkeletonItem key={i} />)}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    height: 100,
    backgroundColor: '#151922',
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 18,
    gap: 12,
  },
  left: { flex: 1.2, gap: 8 },
  middle: { flex: 1.3, gap: 8, paddingHorizontal: 10, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1E2430' },
  right: { flex: 1, gap: 8, alignItems: 'flex-end' },
  title: { width: '80%', height: 16, backgroundColor: '#1E2430', borderRadius: 4 },
  sub: { width: '60%', height: 12, backgroundColor: '#1E2430', borderRadius: 4 },
  badge: { width: 60, height: 20, backgroundColor: '#1E2430', borderRadius: 10 },
  btn: { width: 50, height: 24, backgroundColor: '#1E2430', borderRadius: 12 },
});

export default BookingSkeleton;
