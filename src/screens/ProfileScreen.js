import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import Haptics from '../utils/Haptics';

const { width } = Dimensions.get('window');

const PremiumToggle = ({ value, onValueChange }) => {
    const { colors, isDark } = useTheme();
    const animation = useSharedValue(value ? 1 : 0);

    // Update animation dynamically if value changes from props
    React.useEffect(() => {
        animation.value = withTiming(value ? 1 : 0, { duration: 250 });
    }, [value]);

    const toggleOn = () => {
        Haptics.impactLight();
        onValueChange(!value);
    };

    const trackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animation.value,
            [0, 1],
            [colors.border, colors.primary]
        );
        return { backgroundColor };
    });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withSpring(animation.value * 20, { damping: 15, stiffness: 120 }) }]
        };
    });

    return (
        <TouchableOpacity activeOpacity={1} onPress={toggleOn}>
            <Animated.View style={[styles.customTrack, trackStyle, { borderColor: colors.border }]}>
                <Animated.View style={[styles.customThumb, thumbStyle, { backgroundColor: isDark ? '#FFF' : '#FFF' }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const ActionCard = ({ icon, label, onPress }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <TouchableOpacity 
            activeOpacity={1}
            onPressIn={() => (scale.value = withSpring(0.97))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={() => {
                Haptics.selection();
                if (onPress) onPress();
            }}
            style={styles.actionCardWrapper}
        >
            <Animated.View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }, animatedStyle]}>
                <Icon name={icon} size={22} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const ProfileScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleLogout = () => {
    Haptics.impactMedium();
    navigation.replace('Login');
  };

  return (
    <DashboardLayout 
        activeTab="Profile" 
        onTabPress={(id) => {
            Haptics.selection();
            navigation.navigate(id);
        }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View>
                <Text style={[styles.title, { color: colors.text }]}>Account Settings</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Personalize your workspace experience</Text>
            </View>
        </View>

        <GlassCard style={styles.profileInfoCard}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarBig}>
                    <Text style={styles.avatarInitial}>N</Text>
                </View>
                <View style={styles.userMeta}>
                    <Text style={[styles.userName, { color: colors.text }]}>Nasir Ansari</Text>
                    <Text style={[styles.userRole, { color: colors.textSecondary }]}>Regional Administrator</Text>
                </View>
                <TouchableOpacity style={[styles.editBtn, { borderColor: colors.border }]} onPress={() => Haptics.selection()}>
                    <Text style={[styles.editBtnText, { color: colors.text }]}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.detailsGrid, { backgroundColor: isDark ? '#0C0C0E' : '#EAEAEA', borderColor: colors.border }]}>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>nasir@ofissquare.com</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
                <View style={[styles.detailItem, { paddingLeft: 16 }]}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Mobile</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>+91 98765 43210</Text>
                </View>
            </View>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Preferences</Text>
        <GlassCard style={styles.settingsCard}>
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive real-time alerts for bookings</Text>
                </View>
                <PremiumToggle value={notifications} onValueChange={setNotifications} />
            </View>
            <View style={[styles.settingRow, styles.rowBorder, { borderTopColor: colors.border }]}>
                <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Biometric Login</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Use FaceID or TouchID to access</Text>
                </View>
                <PremiumToggle value={biometrics} onValueChange={setBiometrics} />
            </View>
            <View style={[styles.settingRow, styles.rowBorder, { borderTopColor: colors.border }]}>
                <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                    <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Toggle application appearance</Text>
                </View>
                <PremiumToggle value={isDark} onValueChange={() => toggleTheme()} />
            </View>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Security & Support</Text>
        <View style={styles.actionGrid}>
            <ActionCard icon="lock-closed-outline" label="Password" />
            <ActionCard icon="document-text-outline" label="Documents" />
            <ActionCard icon="headset-outline" label="Support" />
            <ActionCard icon="reader-outline" label="Terms" />
        </View>

        <PremiumButton 
            title="Sign Out" 
            onPress={handleLogout} 
            type="secondary"
            style={[styles.logoutBtn, { borderColor: 'rgba(255, 59, 48, 0.3)', backgroundColor: 'rgba(255, 59, 48, 0.05)' }]}
        />
        <Text style={styles.versionText}>Version 2.4.0 (Build 128)</Text>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110, 
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  profileInfoCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBig: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 138, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  avatarInitial: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  userMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  userRole: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 16,
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  detailsGrid: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: '100%',
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingsCard: {
    padding: 0,
    marginBottom: 28,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  rowBorder: {
    borderTopWidth: 1,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 20,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FONTS.medium,
  },
  customTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
    borderWidth: 1,
  },
  customThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  actionCardWrapper: {
    width: '48%',
  },
  actionCard: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  logoutBtn: {
    height: 56,
  },
  versionText: {
    textAlign: 'center',
    color: '#777777',
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 24,
  },
});

export default ProfileScreen;
