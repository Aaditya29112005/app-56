import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    FadeInDown 
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import PremiumInput from '../components/PremiumInput';
import PremiumButton from '../components/PremiumButton';
import GlassCard from '../components/GlassCard';
import LogoHeader from '../components/LogoHeader';
import Haptics from '../utils/Haptics';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const bgScale = useSharedValue(1);

  React.useEffect(() => {
    bgScale.value = withTiming(1.05, { duration: 4000 });
  }, []);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }]
  }));

  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length > 0;

  const handleLogin = () => {
    if (isFormValid) {
      setIsLoading(true);
      Haptics.notificationSuccess();
      setTimeout(() => {
          setIsLoading(false);
          navigation.replace('Drawer');
      }, 800);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Image with Zoom & Blur */}
      <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
        <Animated.Image 
          source={require('../assets/images/workspace_bg.png')}
          style={StyleSheet.absoluteFill}
          blurRadius={25}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Dark Overlay Tint */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />

      {/* Gradient Overlay for Depth */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="black" stopOpacity="0.85" />
              <Stop offset="0.3" stopColor="black" stopOpacity="0" />
              <Stop offset="0.7" stopColor="black" stopOpacity="0" />
              <Stop offset="1" stopColor="black" stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <LogoHeader />

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <GlassCard style={styles.loginCard}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Access your workspace dashboard</Text>

              <View style={styles.form}>
                <PremiumInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <PremiumInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />

                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                <PremiumButton 
                  title="Continue to Dashboard" 
                  onPress={handleLogin} 
                  style={styles.loginBtn}
                  isLoading={isLoading}
                  disabled={!isFormValid}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>New to Ofis Square? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.linkText}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
            
            <Text style={styles.legalText}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loginCard: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: -8,
  },
  forgotText: {
    color: '#FF8A00',
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  loginBtn: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  linkText: {
    color: '#FF8A00',
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  legalText: {
    marginTop: 48,
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    fontFamily: FONTS.medium,
    alignSelf: 'center',
  }
});

export default LoginScreen;
