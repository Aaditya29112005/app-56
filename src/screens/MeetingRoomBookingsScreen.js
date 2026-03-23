import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, ChevronDown, Users } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import { useMeetingRoomStore } from '../store/useMeetingRoomStore';

import MeetingRoomRow from '../components/MeetingRoom/MeetingRoomRow';
import FilterDropdown from '../components/FilterDropdown';
import VisitorListModal from '../components/MeetingRoom/VisitorListModal';
import AssignCardModal from '../components/MeetingRoom/AssignCardModal';

const MR_THEME = {
  bg: '#000000',
  card: '#111827',
  border: '#1F2937',
  accent: '#F97316',
};

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Booked', value: 'booked' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
];

const MeetingRoomBookingsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { bookings, giveAccessToAll } = useMeetingRoomStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);

  const [activeBooking, setActiveBooking] = useState(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(b => 
        b.room.toLowerCase().includes(q) ||
        b.member.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    }

    if (selectedStatus.value) {
      result = result.filter(b => b.status === selectedStatus.value);
    }

    return result;
  }, [debouncedQuery, selectedStatus, bookings]);

  const handleAction = (type, booking) => {
    setActiveBooking(booking);
    switch (type) {
      case 'GIVE_ACCESS':
        Alert.alert(
          'Give Access',
          `Mark all visitors for ${booking.room} as checked-in?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => giveAccessToAll(booking.id) }
          ]
        );
        break;
      case 'VIEW_VISITORS':
        setShowVisitorModal(true);
        break;
      case 'ADD_VISITOR':
        navigation.navigate('CreateMeetingBooking', { edit: true, bookingId: booking.id });
        break;
      case 'ASSIGN_CARD':
        setShowCardModal(true);
        break;
      default:
        break;
    }
  };

  const TableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: '#1E293B', borderBottomColor: MR_THEME.border }]}>
      <Text style={[styles.headerCell, { flex: 2.2 }]}>ROOM INFO</Text>
      <Text style={[styles.headerCell, { flex: 2.0 }]}>MEMBER</Text>
      <Text style={[styles.headerCell, { flex: 2.5 }]}>TIMING</Text>
      <Text style={[styles.headerCell, { flex: 1.2, textAlign: 'center' }]}>STATUS</Text>
      <Text style={[styles.headerCell, { flex: 1.0, textAlign: 'center' }]}>INVOICE</Text>
      <Text style={[styles.headerCell, { flex: 2.5 }]}>ACTIONS</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: MR_THEME.bg }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: '#FFF' }]}>Meeting Room Bookings</Text>
            <Text style={[styles.subtitle, { color: '#94A3B8' }]}>View meeting room reservations</Text>
          </View>
          <TouchableOpacity 
            style={[styles.createBtn, { backgroundColor: MR_THEME.accent }]}
            onPress={() => navigation.navigate('CreateMeetingBooking')}
          >
            <Plus size={18} color="#FFF" />
            <Text style={styles.createBtnText}>Create New Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <View style={[styles.searchBox, { backgroundColor: MR_THEME.card, borderColor: MR_THEME.border }]}>
            <Search size={18} color="#64748B" />
            <TextInput 
              style={[styles.searchInput, { color: '#FFF' }]}
              placeholder="Search by room, member, status..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={[styles.statusToggle, { backgroundColor: MR_THEME.card, borderColor: MR_THEME.border }]}
            onPress={() => setShowStatusFilter(true)}
          >
            <Text style={styles.statusLabel}>{selectedStatus.label}</Text>
            <ChevronDown size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Content */}
      <View style={styles.tableContainer}>
        <FlatList 
          data={filteredBookings}
          keyExtractor={item => item.id}
          ListHeaderComponent={TableHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item, index }) => (
            <MeetingRoomRow item={item} index={index} onAction={handleAction} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Users size={48} color={MR_THEME.border} />
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters or search.</Text>
            </View>
          }
        />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: MR_THEME.border }]}>
        <Text style={styles.pageInfo}>Page 1 of 1</Text>
        <View style={styles.pageActions}>
           <TouchableOpacity style={styles.pageBtn} disabled><Text style={styles.pageBtnText}>Prev</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pageBtn} disabled><Text style={styles.pageBtnText}>Next</Text></TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <FilterDropdown 
        visible={showStatusFilter}
        title="Filter by Status"
        options={STATUS_OPTS}
        selectedOption={selectedStatus}
        onClose={() => setShowStatusFilter(false)}
        onSelect={setSelectedStatus}
      />

      <VisitorListModal 
        visible={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        visitors={activeBooking?.visitors}
        bookingTitle={activeBooking?.room}
      />

      <AssignCardModal 
        visible={showCardModal}
        onClose={() => setShowCardModal(false)}
        booking={activeBooking}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  createBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusLabel: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#FFF',
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: SPACING.lg,
    backgroundColor: MR_THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MR_THEME.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#64748B',
    letterSpacing: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#FFF',
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  pageInfo: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
  },
  pageActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  pageBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#64748B',
  },
});

export default MeetingRoomBookingsScreen;
