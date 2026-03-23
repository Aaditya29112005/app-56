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
import Logo from '../components/Onboarding/Logo';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PAGES = [
    {
        id: '1',
        type: 'logo',
    },
    {
        id: '2',
        title: 'Manage your\nworkspace effortlessly',
        subtitle: 'Everything you need in one powerful platform.',
        type: 'text',
    },
    {
        id: '3',
        title: 'Connect with\nyour community',
        subtitle: 'Engage with members and grow your network.',
        type: 'text',
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
    const bgScale = useSharedValue(1);

    React.useEffect(() => {
        bgScale.value = withTiming(1.05, { duration: 3000 });
    }, []);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const bgAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }]
    }));

    const handleGetStarted = () => {
        Haptics.impactMedium();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
                <Animated.Image 
                    source={require('../assets/images/workspace_bg.png')}
                    style={StyleSheet.absoluteFill}
                    blurRadius={25}
                    resizeMode="cover"
                />
            </Animated.View>

            {/* Dark Overlay Tint */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.65)' }]} />

            {/* Gradient Overlay using SVG */}
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="black" stopOpacity="0.8" />
                            <Stop offset="0.3" stopColor="black" stopOpacity="0" />
                            <Stop offset="0.7" stopColor="black" stopOpacity="0" />
                            <Stop offset="1" stopColor="black" stopOpacity="0.9" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
            </View>
            
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
                            [(index - 0.5) * width, index * width, (index + 0.5) * width],
                            [0, 1, 0],
                            Extrapolate.CLAMP
                        );
                        return { opacity };
                    });

                    return (
                        <View key={page.id} style={styles.page}>
                            {page.type === 'logo' ? (
                                <Animated.View style={[styles.logoContainer, animatedStyle]}>
                                    <Logo />
                                </Animated.View>
                            ) : (
                                <Animated.View style={[styles.textContainer, animatedStyle]}>
                                    <View style={[styles.focusCircle, { borderColor: 'rgba(255,138,0,0.1)' }]}>
                                        <Text style={styles.title}>{page.title}</Text>
                                        <Text style={[styles.subtitle, { color: COLORS.white + '80' }]}>
                                            {page.subtitle}
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}
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
        backgroundColor: '#000000',
    },
    page: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        width,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    focusCircle: {
        width: 320,
        height: 320,
        borderRadius: 160,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: COLORS.white,
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 150,
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
        height: 58,
        width: '100%',
    }
});

export default OnboardingScreen;
