import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import PremiumInput from '../components/PremiumInput';
import PremiumButton from '../components/PremiumButton';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import OfisLogo from '../components/OfisLogo';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid = emailRegex.test(email) && password.length > 0;

  const validate = () => {
    let newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateEmail = (val) => {
    setEmail(val);
    if (errors.email) setErrors({...errors, email: null});
  };

  const updatePassword = (val) => {
    setPassword(val);
    if (errors.password) setErrors({...errors, password: null});
  };

  const handleLogin = () => {
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          navigation.replace('Drawer');
      }, 800);
    }
  };

  return (
    <Layout scrollable={true} backgroundColor="#000000">
      <View style={styles.container}>
        <Animated.View 
            entering={FadeIn.duration(800).delay(200)} 
            style={styles.header}
        >
            <OfisLogo scale={0.7} />
        </Animated.View>

        <Animated.View entering={SlideInDown.duration(800).springify().damping(18)}>
            <GlassCard style={styles.loginCard}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Access your workspace dashboard</Text>

              <View style={styles.form}>
                <PremiumInput
                  label="Email Address"
                  placeholder="name@company.com"
                  value={email}
                  onChangeText={updateEmail}
                  keyboardType="email-address"
                  error={errors.email}
                />
                <PremiumInput
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={updatePassword}
                  secureTextEntry={true}
                  error={errors.password}
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
                  <Text style={styles.footerText}>New to Ofissquare? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoSquare: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    letterSpacing: 4,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: SPACING.xl,
    backgroundColor: '#1A1A1A', // Softer black gradient equivalent
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: '#8A8A8A',
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotText: {
    color: '#FF8A00',
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  loginBtn: {
    height: 56,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#8A8A8A',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
  },
  linkText: {
    color: '#FF8A00',
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  legalText: {
    marginTop: 48,
    color: '#555555',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
    fontFamily: FONTS.medium,
    alignSelf: 'center',
  }
});

export default LoginScreen;
