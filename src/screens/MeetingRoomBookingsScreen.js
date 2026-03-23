import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import bookingApi from '../services/bookingApi';
import MeetingRoomCard from '../components/MeetingRoom/MeetingRoomCard';
import BookingSkeleton from '../components/MeetingRoom/BookingSkeleton';
import SearchBar from '../components/SearchBar';
import StatusDropdown from '../components/StatusDropdown';
import CreateBookingModal from '../modals/CreateBookingModal';
import BookingDetailsModal from '../modals/BookingDetailsModal';

import { FONTS } from '../theme/typography';

const { width } = Dimensions.get('window');

const MeetingRoomBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      // Small simulated delay for skeleton effect
      setTimeout(() => setLoading(false), 1200);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.roomName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.memberName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleCreatePress = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    setShowCreateModal(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>Meeting Room Bookings</Text>
          <Text style={styles.subtitle}>View meeting room reservations</Text>
        </View>
        <TouchableOpacity 
          style={styles.createBtn}
          onPress={handleCreatePress}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFF" />
          <Text style={styles.createBtnText}>Create Booking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <SearchBar onSearch={setSearchQuery} />
        <StatusDropdown selected={statusFilter} onSelect={setStatusFilter} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {loading ? (
        <BookingSkeleton />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MeetingRoomCard 
               booking={item} 
               onAction={(type, booking) => {
                 if (type === 'view') {
                   ReactNativeHapticFeedback.trigger('impactLight');
                   setSelectedBooking(booking);
                 }
               }} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters or search query.</Text>
            </View>
          }
        />
      )}

      <CreateBookingModal 
        visible={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => {
            console.log('New Booking:', data);
        }}
      />

      <BookingDetailsModal 
        visible={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#FFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8A00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  createBtnText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});

export default MeetingRoomBookingsScreen;
