import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DashboardScreen from '../screens/DashboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FONTS } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import Haptics from '../utils/Haptics';

const Tab = createBottomTabNavigator();

const TabButton = ({ route, label, isFocused, onPress, options, isDark }) => {
    const scale = useSharedValue(isFocused ? 1 : 0.95);

    React.useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0.95, {
            damping: 12,
            stiffness: 100
        });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    let iconName = 'grid-outline';
    if (route.name === 'Community') iconName = 'people-outline';
    if (route.name === 'Profile') iconName = 'person-outline';

    if (isFocused) {
        if (route.name === 'Dashboard') iconName = 'grid';
        if (route.name === 'Community') iconName = 'people';
        if (route.name === 'Profile') iconName = 'person';
    }

    const inactiveColor = isDark ? '#71717A' : '#9CA3AF';

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
                Haptics.selection();
                onPress();
            }}
            style={styles.tabItem}
            activeOpacity={1}
        >
            <Animated.View style={[styles.tabContent, animatedStyle]}>
                <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                    <Icon
                        name={iconName}
                        size={22}
                        color={isFocused ? '#FF8A00' : inactiveColor}
                    />
                </View>
                <Text style={[
                  styles.tabLabel, 
                  { 
                    color: isFocused ? '#FF8A00' : inactiveColor, 
                    fontFamily: isFocused ? FONTS.bold : FONTS.medium 
                  }
                ]}>
                    {label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const bottomOffset = Math.max(insets.bottom, 10) + 8;

  return (
    <View style={[
      styles.tabBarContainer, 
      { 
        bottom: bottomOffset,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        shadowOpacity: isDark ? 0.25 : 0.1,
      }
    ]}>
      <View style={[
        styles.glassBackground, 
        { backgroundColor: isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)' }
      ]} />
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
              <TabButton 
                  key={index} 
                  route={route} 
                  label={label} 
                  isFocused={isFocused} 
                  onPress={onPress} 
                  options={options}
                  isDark={isDark}
              />
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 72,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 25,
    elevation: 15,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  tabContent: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 138, 0, 0.12)',
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});

export default TabNavigator;
