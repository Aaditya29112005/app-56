import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
    withTiming
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import PremiumButton from '../components/PremiumButton';
import Haptics from '../utils/Haptics';

const { width, height } = Dimensions.get('window');

const PAGES = [
    {
        id: '1',
        title: 'Manage your workspace effortlessly',
    },
    {
        id: '2',
        title: 'Bookings, access, analytics in one place',
    },
    {
        id: '3',
        title: 'Connect with your community',
    }
];

const PaginationDot = ({ index, scrollX }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 24, 8],
            Extrapolate.CLAMP
        );
        const opacityAnimation = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.3, 1, 0.3],
            Extrapolate.CLAMP
        );
        const colorAnimation = interpolateColor(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            ['#3A3A3C', '#FF8A00', '#3A3A3C']
        );
        
        return {
            width: widthAnimation,
            opacity: opacityAnimation,
            backgroundColor: scrollX.value >= (index - 0.5) * width && scrollX.value <= (index + 0.5) * width ? '#FF8A00' : '#3A3A3C'
        };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

// Polyfill for interpolateColor inside useAnimatedStyle if not imported directly
const interpolateColor = (value, inputRange, outputRange) => {
    'worklet';
    return value >= inputRange[1] ? outputRange[1] : value <= inputRange[0] ? outputRange[0] : outputRange[0];
};

const OnboardingScreen = ({ navigation }) => {
    const scrollX = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleGetStarted = () => {
        Haptics.impactMedium();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000000" barStyle="light-content" />
            
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                {PAGES.map((page, index) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        const opacity = interpolate(
                            scrollX.value,
                            [(index - 1) * width, index * width, (index + 1) * width],
                            [0, 1, 0],
                            Extrapolate.CLAMP
                        );
                        const translateY = interpolate(
                            scrollX.value,
                            [(index - 1) * width, index * width, (index + 1) * width],
                            [20, 0, -20],
                            Extrapolate.CLAMP
                        );
                        return {
                            opacity,
                            transform: [{ translateY }]
                        };
                    });

                    return (
                        <View key={page.id} style={styles.page}>
                            {/* Decorative Orange Blur Sphere acting as parallax */}
                            <Animated.View style={[styles.parallaxSphere, {
                                transform: [{
                                    translateX: interpolate(scrollX.value, [(index-1)*width, index*width, (index+1)*width], [width*0.5, 0, -width*0.5])
                                }]
                            }]} />
                            
                            <Animated.View style={[styles.textContainer, animatedStyle]}>
                                <Text style={styles.title}>{page.title}</Text>
                            </Animated.View>
                        </View>
                    );
                })}
            </Animated.ScrollView>

            <View style={styles.paginationContainer}>
                {PAGES.map((_, index) => (
                    <PaginationDot key={index} index={index} scrollX={scrollX} />
                ))}
            </View>

            <View style={styles.footer}>
                <PremiumButton 
                    title="Get Started" 
                    onPress={handleGetStarted}
                    style={styles.actionBtn}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Strict Black
    },
    page: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    parallaxSphere: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#FF8A00',
        opacity: 0.05,
        top: '30%',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: -100, // Offset to balance visually
    },
    title: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.white,
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 40,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 140, // Above button safely
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        paddingHorizontal: 24,
    },
    actionBtn: {
        height: 56,
        width: '100%',
    }
});

export default OnboardingScreen;
