import React, { useState, useRef } from 'react';
import { 
    ScrollView, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    View, 
    LayoutAnimation 
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring 
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import Haptics from '../../utils/Haptics';

const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
    const { colors, isDark } = useTheme();
    const [layouts, setLayouts] = useState({});
    
    const pillX = useSharedValue(0);
    const pillWidth = useSharedValue(0);

    const handleTabLayout = (event, tab) => {
        const { x, width } = event.nativeEvent.layout;
        const newLayouts = { ...layouts, [tab]: { x, width } };
        setLayouts(newLayouts);
        
        if (tab === activeTab) {
            pillX.value = withSpring(x);
            pillWidth.value = withSpring(width);
        }
    };

    React.useEffect(() => {
        if (layouts[activeTab]) {
            pillX.value = withSpring(layouts[activeTab].x, { damping: 15 });
            pillWidth.value = withSpring(layouts[activeTab].width, { damping: 15 });
        }
    }, [activeTab, layouts]);

    const animatedPillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: pillX.value }],
        width: pillWidth.value,
        opacity: pillWidth.value === 0 ? 0 : 1,
    }));

    return (
        <View style={styles.wrapper}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.container}
            >
                <Animated.View style={[
                    styles.pillHighlight, 
                    { backgroundColor: '#FF8A00' },
                    animatedPillStyle
                ]} />
                
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.7}
                            onLayout={(e) => handleTabLayout(e, tab)}
                            onPress={() => {
                                Haptics.selection();
                                onTabChange(tab);
                            }}
                            style={styles.tab}
                        >
                            <Text style={[
                                styles.tabText,
                                { color: isActive ? '#FFF' : colors.textMuted }
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
        marginTop: 8,
    },
    container: {
        paddingHorizontal: 20,
        height: 44,
        alignItems: 'center',
    },
    pillHighlight: {
        position: 'absolute',
        height: '80%',
        borderRadius: 20,
        top: '10%',
        shadowColor: '#FF8A00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        marginRight: 8,
    },
    tabText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
    }
});

export default FilterTabs;
