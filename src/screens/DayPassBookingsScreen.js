import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import BookingCard from '../components/DayPass/BookingCard';
import BookingDetailsModal from '../components/DayPass/BookingDetailsModal';
import SearchBar from '../components/DayPass/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import BookingSkeleton from '../components/MeetingRoom/BookingSkeleton';

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Payment Pending', value: 'payment_pending' },
  { label: 'Issued', value: 'issued' },
  { label: 'Invited', value: 'invited' },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Checked Out', value: 'checked_out' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MOCK_BOOKINGS = [
  {
    id: "1",
    building: "Sohna Road, Gurugram",
    customerName: "Nasir Ansari",
    email: "nasir@flyde.in",
    date: "2026-03-18T05:30:00",
    status: "payment_pending",
    invoice: null
  },
  {
    id: "2",
    building: "Empire State, NYC",
    customerName: "John Doe",
    email: "john.doe@sky.com",
    date: "2026-03-19T09:00:00",
    status: "issued",
    invoice: "INV-8821"
  },
  {
    id: "3",
    building: "Sohna Road, Gurugram",
    customerName: "Sarah Williams",
    email: "sarah.w@notion.so",
    date: "2026-03-20T11:45:00",
    status: "checked_in",
    invoice: "INV-8825"
  },
  {
    id: "4",
    building: "Cyber City, Dubai",
    customerName: "Alex Rivera",
    email: "alex@linear.app",
    date: "2026-03-21T14:20:00",
    status: "invited",
    invoice: null
  },
  {
    id: "5",
    building: "Sohna Road, Gurugram",
    customerName: "Bruce Wayne",
    email: "bruce@wayne.com",
    date: "2026-03-22T08:30:00",
    status: "checked_out",
    invoice: "INV-8901"
  },
  {
    id: "6",
    building: "Silicon Valley Hub, CA",
    customerName: "Tony Stark",
    email: "tony@stark.com",
    date: "2026-03-23T10:00:00",
    status: "cancelled",
    invoice: null
  }
];

const DayPassBookingsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredBookings = useMemo(() => {
    let result = MOCK_BOOKINGS;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(b => 
        b.customerName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.building.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    }

    if (selectedStatus.value) {
      result = result.filter(b => b.status === selectedStatus.value);
    }

    return result;
  }, [debouncedQuery, selectedStatus]);

  const PaginationUI = () => (
    <View style={[styles.pagination, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
      <Text style={[styles.pageInfo, { color: colors.textSecondary }]}>Page 1 of 1</Text>
      <View style={styles.pageActions}>
        <TouchableOpacity style={[styles.pageBtn, styles.disabledBtn]}>
          <Text style={styles.disabledBtnText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pageBtn, styles.disabledBtn]}>
          <Text style={styles.disabledBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Day Pass Bookings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>View day pass reservations</Text>
          </View>
          <TouchableOpacity 
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('BookDayPass')}
          >
             <Plus size={16} color="#FFF" />
             <Text style={styles.newBtnText}>New Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search by customer, visitor..." 
          />
          <TouchableOpacity 
            style={[styles.statusToggle, { backgroundColor: isDark ? '#151922' : colors.card, borderColor: isDark ? '#1E2430' : colors.border }]}
            onPress={() => setShowStatusFilter(true)}
          >
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
               {selectedStatus.value ? selectedStatus.label : 'All Status'}
            </Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
        {loading ? (
          <BookingSkeleton />
        ) : (
          <FlatList 
            data={filteredBookings}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <BookingCard item={item} onView={setActiveBooking} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No bookings found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Try adjusting your filters or search.</Text>
              </View>
            }
          />
        )}
        
        <PaginationUI />
      </KeyboardAvoidingView>

      {/* Modals & Sheets */}
      <FilterDropdown 
        visible={showStatusFilter}
        title="Filter by Status"
        options={STATUS_OPTS}
        selectedOption={selectedStatus}
        onClose={() => setShowStatusFilter(false)}
        onSelect={setSelectedStatus}
      />

      <BookingDetailsModal 
        visible={!!activeBooking}
        booking={activeBooking}
        onClose={() => setActiveBooking(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    padding: SPACING.md,
    gap: SPACING.md,
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
    fontSize: FONT_SIZE.xs,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    gap: 6,
  },
  newBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  statusLabel: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
  emptySubtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  pagination: {
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
  },
  pageActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  disabledBtn: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  disabledBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default DayPassBookingsScreen;
