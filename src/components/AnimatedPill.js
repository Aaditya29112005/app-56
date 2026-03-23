import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Haptics from '../utils/Haptics';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedPill = ({ children, onPress, style }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
            opacity: withTiming(opacity.value, { duration: 150 })
        };
    });

    const handlePressIn = useCallback(() => {
        scale.value = 0.95;
        opacity.value = 0.8;
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = 1;
        opacity.value = 1;
    }, []);

    const handlePress = useCallback(() => {
        Haptics.impactLight();
        if (onPress) onPress();
    }, [onPress]);

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.pill, animatedStyle, style]}
        >
            {children}
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#121212', // Subtle inner depth
        borderWidth: 1,
        borderColor: '#1A1A1A', // Very subtle border
        borderRadius: 24, // Precise rounding from wireframe
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    }
});

export default AnimatedPill;
