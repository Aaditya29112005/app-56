import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { X, User, Mail, Phone, Briefcase } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const VisitorForm = ({ visitor, onUpdate, onRemove }) => {
  const handleChange = (field, val) => {
    onUpdate({ ...visitor, [field]: val });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <User size={16} color="#94A3B8" />
        <Text style={styles.title}>Visitor Information</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <X size={16} color="#F43F5E" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={styles.inputBox}>
          <Mail size={14} color="#64748B" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#64748B"
            value={visitor.email}
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Phone size={14} color="#64748B" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#64748B"
            value={visitor.phone}
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange('phone', v)}
          />
        </View>

        <View style={[styles.inputBox, { width: '100%' }]}>
          <Briefcase size={14} color="#64748B" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor="#64748B"
            value={visitor.company}
            onChangeText={(v) => handleChange('company', v)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#1E293B', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#334155',
    padding: 16,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  title: { fontFamily: FONTS.bold, fontSize: 13, color: '#F8FAFC', flex: 1 },
  removeBtn: { padding: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  inputBox: { 
    width: '48%', 
    height: 44, 
    backgroundColor: '#0F172A', 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontFamily: FONTS.medium, fontSize: 13, color: '#FFF' },
});

export default VisitorForm;
