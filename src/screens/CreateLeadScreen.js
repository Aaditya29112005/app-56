import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import RadioGroup from '../components/Leads/RadioGroup';

const LEADS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', required }) => (
  <View style={styles.inputWrap}>
    <Text style={styles.label}>{label} {required && <Text style={{color: '#EF4444'}}>*</Text>}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={LEADS_THEME.textSecondary}
      keyboardType={keyboardType}
    />
  </View>
);

const CreateLeadScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    gender: 'Male',
    address: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleContinue = () => {
    // Basic Validation
    const req = ['firstName', 'lastName', 'email', 'phone'];
    let valid = true;
    let newErrors = {};

    req.forEach(r => {
      if (!form[r].trim()) {
        valid = false;
        newErrors[r] = true;
      }
    });

    if (!valid) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    setErrors({});
    // Pseudo Success
    Alert.alert('Success', 'Lead information saved! Proceeding to next step.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: LEADS_THEME.bg }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
           <Text style={styles.title}>Create Lead</Text>
           <Text style={styles.subtitle}>Step 1: Initial Enquiry</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView style={styles.formArea} showsVerticalScrollIndicator={false}>
           
           <View style={styles.card}>
              <View style={styles.row}>
                <View style={{flex: 1, marginRight: SPACING.sm}}>
                  <FormInput label="First Name" required value={form.firstName} onChangeText={(v) => handleChange('firstName', v)} placeholder="John" />
                </View>
                <View style={{flex: 1, marginLeft: SPACING.sm}}>
                  <FormInput label="Last Name" required value={form.lastName} onChangeText={(v) => handleChange('lastName', v)} placeholder="Doe" />
                </View>
              </View>
              
              <FormInput label="Email Address" required value={form.email} onChangeText={(v) => handleChange('email', v)} placeholder="john@example.com" keyboardType="email-address" />
              <FormInput label="Phone Number" required value={form.phone} onChangeText={(v) => handleChange('phone', v)} placeholder="+1 555-0000" keyboardType="phone-pad" />
              <FormInput label="Company Name" value={form.company} onChangeText={(v) => handleChange('company', v)} placeholder="Acme Corp" />
              
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Gender</Text>
                 <RadioGroup 
                   options={[
                     { label: 'Male', value: 'Male' },
                     { label: 'Female', value: 'Female' },
                     { label: 'Other', value: 'Other' }
                   ]}
                   selectedValue={form.gender}
                   onSelect={(v) => handleChange('gender', v)}
                 />
              </View>

              <FormInput label="Address" value={form.address} onChangeText={(v) => handleChange('address', v)} placeholder="Enter full address" />
              <FormInput label="Pincode" value={form.pincode} onChangeText={(v) => handleChange('pincode', v)} placeholder="000000" keyboardType="numeric" />
              
           </View>

        </ScrollView>

        <View style={styles.footer}>
           <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => navigation.goBack()}>
             <Text style={styles.cancelTxt}>Cancel</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btn, styles.continueBtn, { backgroundColor: colors.primary }]} onPress={handleContinue}>
             <Text style={styles.continueTxt}>Continue</Text>
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: LEADS_THEME.border
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LEADS_THEME.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md
  },
  title: { fontFamily: FONTS.bold, fontSize: 20, color: '#FFF', marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs, color: LEADS_THEME.textSecondary },
  
  formArea: { flex: 1, padding: SPACING.md },
  card: {
    backgroundColor: LEADS_THEME.card,
    borderWidth: 1,
    borderColor: LEADS_THEME.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: 40
  },
  row: { flexDirection: 'row' },
  inputWrap: { marginBottom: SPACING.lg },
  label: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: LEADS_THEME.textSecondary,
    marginBottom: 8
  },
  input: {
    height: 48,
    backgroundColor: LEADS_THEME.bg,
    borderWidth: 1,
    borderColor: LEADS_THEME.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    color: '#FFF'
  },
  
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: LEADS_THEME.border,
    backgroundColor: LEADS_THEME.bg,
    gap: SPACING.md
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: LEADS_THEME.border,
    backgroundColor: LEADS_THEME.card
  },
  cancelTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFF' },
  continueBtn: {},
  continueTxt: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: '#FFF' }
});

export default CreateLeadScreen;
