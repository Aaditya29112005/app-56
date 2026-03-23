import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    interpolateColor
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import Haptics from '../utils/Haptics';

const { width } = Dimensions.get('window');

const BottomTabs = ({ activeTab, onTabPress }) => {
    const { colors, isDark } = useTheme();

    const tabs = [
        { id: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
        { id: 'Community', icon: 'people-outline', activeIcon: 'people' },
        { id: 'Profile', icon: 'person-outline', activeIcon: 'person' }
    ];

    const TabButton = ({ tab }) => {
        const isActive = activeTab === tab.id;
        const scale = useSharedValue(isActive ? 1.1 : 1);
        
        React.useEffect(() => {
            scale.value = withSpring(isActive ? 1.15 : 1);
        }, [isActive]);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        const glowStyle = useAnimatedStyle(() => ({
            opacity: isActive ? withSpring(0.3) : withSpring(0),
            transform: [{ scale: isActive ? 1.2 : 0.8 }]
        }));

        return (
            <TouchableOpacity 
                onPress={() => {
                    Haptics.impactLight();
                    onTabPress(tab.id);
                }}
                style={styles.tabBtn}
                activeOpacity={0.7}
            >
                <View style={styles.iconWrapper}>
                    {isActive && (
                        <Animated.View style={[
                            styles.glow, 
                            { backgroundColor: '#FF8A00' },
                            glowStyle
                        ]} />
                    )}
                    <Animated.View style={animatedStyle}>
                        <Icon 
                            name={isActive ? tab.activeIcon : tab.icon} 
                            size={24} 
                            color={isActive ? '#FF8A00' : colors.textMuted} 
                        />
                    </Animated.View>
                </View>
                <Text style={[
                    styles.tabText, 
                    { color: isActive ? '#FF8A00' : colors.textMuted }
                ]}>
                    {tab.id}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[
            styles.container, 
            { 
                backgroundColor: isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)',
                borderTopColor: colors.border 
            }
        ]}>
            {tabs.map(tab => (
                <TabButton key={tab.id} tab={tab} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 85,
        borderTopWidth: 1,
        paddingBottom: 20,
        paddingHorizontal: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 44,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        blurRadius: 10,
    },
    tabText: {
        fontSize: 10,
        fontFamily: FONTS.bold,
        marginTop: 4,
    }
});

export default BottomTabs;
