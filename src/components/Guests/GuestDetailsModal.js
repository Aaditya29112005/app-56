import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const GUESTS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);

const SectionBlock = ({ title, children }) => (
  <View style={styles.sectionBlock}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const GuestDetailsModal = ({ visible, user, onClose }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 10 })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;
  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
           <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[
          styles.modalBox, 
          { transform: [{ scale: scaleAnim }], opacity: fadeAnim }
        ]}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Guest Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <X size={20} color={GUESTS_THEME.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
             
             <SectionBlock title="Basic Info">
               <InfoRow label="Name" value={user.name} />
               <InfoRow label="Email" value={user.email} />
               <InfoRow label="Phone" value={user.phone} />
               <InfoRow label="Company" value={user.company} />
             </SectionBlock>

             <SectionBlock title="Additional Info">
               <InfoRow label="Zoho Contact ID" value={user.zohoContactId} />
             </SectionBlock>

          </ScrollView>

          <View style={styles.footer}>
             <TouchableOpacity style={styles.footerBtn} onPress={onClose}>
                <Text style={styles.footerBtnTxt}>Close Details</Text>
             </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  modalBox: {
    backgroundColor: GUESTS_THEME.card,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: GUESTS_THEME.border,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: GUESTS_THEME.border
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: '#FFF'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GUESTS_THEME.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollArea: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md
  },
  sectionBlock: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: GUESTS_THEME.textSecondary,
    flex: 0.4
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF',
    flex: 0.6,
    textAlign: 'right'
  },
  footer: {
    padding: SPACING.xl,
    paddingTop: SPACING.md
  },
  footerBtn: {
    borderWidth: 1,
    borderColor: GUESTS_THEME.border,
    backgroundColor: GUESTS_THEME.bg,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerBtnTxt: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: '#FFF'
  }
});

export default GuestDetailsModal;
