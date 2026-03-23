import React from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  ScrollView, Dimensions 
} from 'react-native';
import { X, Calendar, Clock, MapPin, Users, Coffee, UserPlus, Fingerprint } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

const BookingDetailsModal = ({ visible, booking, onClose }) => {
  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Booking Details</Text>
              <View style={[styles.statusBadge, { backgroundColor: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 138, 0, 0.1)' }]}>
                <Text style={[styles.statusText, { color: booking.status === 'COMPLETED' ? '#10B981' : '#FF8A00' }]}>{booking.status}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
               <View style={styles.infoRow}>
                  <MapPin size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={styles.infoLabel}>Meeting Room</Text>
                     <Text style={styles.infoValue}>{booking.roomName}</Text>
                     <Text style={styles.infoSub}>{booking.capacity} Persons Max</Text>
                  </View>
               </View>

               <View style={styles.infoRow}>
                  <Calendar size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={styles.infoLabel}>Schedule</Text>
                     <Text style={styles.infoValue}>{booking.startTime}</Text>
                     <Text style={styles.infoValue}>{booking.endTime}</Text>
                  </View>
               </View>

               <View style={styles.infoRow}>
                  <Fingerprint size={20} color="#64748B" />
                  <View style={styles.infoCol}>
                     <Text style={styles.infoLabel}>Member</Text>
                     <Text style={styles.infoValue}>{booking.memberName}</Text>
                     <Text style={styles.infoSub}>{booking.memberLocation}</Text>
                  </View>
               </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Catering & Items</Text>
               <View style={styles.tagGrid}>
                  {booking.catering.length > 0 ? booking.catering.map((item, i) => (
                    <View key={i} style={styles.tag}>
                       <Coffee size={14} color="#FF8A00" />
                       <Text style={styles.tagText}>{item}</Text>
                    </View>
                  )) : (
                    <Text style={styles.emptyText}>No catering assigned</Text>
                  )}
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Visitors ({booking.visitors.length})</Text>
               {booking.visitors.length > 0 ? booking.visitors.map((v, i) => (
                 <View key={i} style={styles.visitorItem}>
                    <UserPlus size={16} color="#64748B" />
                    <View>
                       <Text style={styles.visitorName}>{v.name}</Text>
                       <Text style={styles.visitorEmail}>{v.email}</Text>
                    </View>
                 </View>
               )) : (
                 <Text style={styles.emptyText}>No visitors added</Text>
               )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notesText}>{booking.notes || 'No additional notes'}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.accessBtn}>
             <Fingerprint size={20} color="#FFF" />
             <Text style={styles.accessBtnText}>Manage Access Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#151922',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E2430',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: '#FFF',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2430',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#FFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: '#FFF',
  },
  infoSub: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E2430',
    marginBottom: 24,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2430',
    gap: 6,
  },
  tagText: {
    color: '#FFF',
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  emptyText: {
    color: '#475569',
    fontSize: 13,
    fontStyle: 'italic',
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2430',
  },
  visitorName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#FFF',
  },
  visitorEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  notesText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2430',
  },
  accessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    height: 54,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
  },
  accessBtnText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 16,
  }
});

export default BookingDetailsModal;
