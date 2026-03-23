import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import PremiumInput from '../components/PremiumInput';
import PremiumButton from '../components/PremiumButton';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (setter, field) => (val) => {
    setter(val);
    if (errors[field]) setErrors({...errors, [field]: null});
  };

  const handleRegister = () => {
    if (validate()) {
      navigation.replace('Drawer');
    }
  };

  return (
    <Layout scrollable={true} backgroundColor={COLORS.background}>
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.logoSquare}>
                <Text style={styles.logoText}>O</Text>
            </View>
            <Text style={styles.brandTitle}>OFISSQUARE</Text>
        </View>

        <GlassCard style={styles.registerCard}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your premium workspace journey</Text>

          <View style={styles.form}>
            <PremiumInput
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={updateField(setName, 'name')}
              error={errors.name}
            />
            <PremiumInput
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChangeText={updateField(setEmail, 'email')}
              keyboardType="email-address"
              error={errors.email}
            />
            <PremiumInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={updateField(setPassword, 'password')}
              secureTextEntry={true}
              error={errors.password}
            />

            <PremiumButton 
                title="Create Account" 
                onPress={handleRegister} 
                style={styles.registerBtn} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already part of community? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
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
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
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
  registerCard: {
    width: '100%',
    maxWidth: 400,
    padding: SPACING.xl,
    borderRadius: 24,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
  },
  registerBtn: {
    marginTop: SPACING.md,
    height: 52,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
});

export default RegisterScreen;
