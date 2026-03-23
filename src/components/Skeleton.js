import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';

const Skeleton = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [layoutWidth, setLayoutWidth] = React.useState(0);

  React.useEffect(() => {
    if (layoutWidth > 0) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [layoutWidth]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-layoutWidth || -100, layoutWidth || 100],
  });

  return (
    <View
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    >
      {layoutWidth > 0 && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX }],
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
});

export default Skeleton;
