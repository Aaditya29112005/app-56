import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import UserRowCard from '../components/Guests/UserRowCard';
import GuestDetailsModal from '../components/Guests/GuestDetailsModal';
import PaginationBar from '../components/Guests/PaginationBar';

const GUESTS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const ITEMS_PER_PAGE = 5;

const MOCK_GUESTS = [
  { id: '1', name: 'Nasir', email: 'john.doe@example.com', phone: '7709690548', company: 'Ofis sohna square', createdAt: '2026-02-23T15:37:00', zohoContactId: '35013800000229001' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@designco.com', phone: '555-0199', company: 'DesignCo', createdAt: '2026-01-15T10:20:00', zohoContactId: '35013800000229002' },
  { id: '3', name: 'Robert Johnson', email: 'robert@startup.io', phone: '555-0200', company: 'Startup IO', createdAt: '2026-03-01T09:00:00', zohoContactId: '35013800000229003' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@corporate.net', phone: '555-0300', company: 'Corporate Net', createdAt: '2025-11-20T14:45:00', zohoContactId: '35013800000229004' },
  { id: '5', name: 'Michael Brown', email: 'mike@builders.com', phone: '555-0400', company: 'Builders Inc', createdAt: '2026-03-10T16:30:00', zohoContactId: '35013800000229005' },
  { id: '6', name: 'Sarah Wilson', email: 'sarah@freelance.org', phone: '555-0500', company: 'Freelance Space', createdAt: '2026-03-15T11:15:00', zohoContactId: '35013800000229006' },
  { id: '7', name: 'David Lee', email: 'david.l@techhub.com', phone: '555-0600', company: 'Tech Hub', createdAt: '2026-03-18T08:20:00', zohoContactId: '35013800000229007' }
];

const OnDemandUsersScreen = () => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredGuests = useMemo(() => {
    if (!debouncedQuery.trim()) return MOCK_GUESTS;
    const q = debouncedQuery.toLowerCase();
    return MOCK_GUESTS.filter(g => 
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.includes(q)
    );
  }, [debouncedQuery]);

  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE) || 1;
  
  const displayedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuests, currentPage]);

  const handleSearchBtn = () => {
    setDebouncedQuery(searchQuery);
    setCurrentPage(1);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
         <View style={styles.headerTop}>
            <View style={{flex: 1}}>
              <Text style={styles.title}>On-demand Users (Guests)</Text>
              <Text style={styles.subtitle}>Search and manage one-time/guest users</Text>
            </View>
         </View>

         {/* Search Filter input group */}
         <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
               <Search size={18} color={GUESTS_THEME.textSecondary} />
               <TextInput 
                 style={styles.searchInput}
                 placeholder="Search by name, email..."
                 placeholderTextColor={GUESTS_THEME.textSecondary}
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoCorrect={false}
                 returnKeyType="search"
                 onSubmitEditing={handleSearchBtn}
               />
            </View>
            <TouchableOpacity 
              style={[styles.searchBtn, { backgroundColor: colors.primary }]}
              onPress={handleSearchBtn}
            >
               <Text style={styles.searchBtnTxt}>Search</Text>
            </TouchableOpacity>
         </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <FlatList 
          data={displayedGuests}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserRowCard user={item} onView={setSelectedUser} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={48} color={GUESTS_THEME.border} style={{marginBottom: SPACING.md}} />
              <Text style={styles.emptyTitle}>No guests found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search criteria.</Text>
            </View>
          }
        />

        {/* Pagination Sticky Bottom */}
        <View style={styles.paginationWrap}>
          <PaginationBar 
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
            onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          />
        </View>
      </KeyboardAvoidingView>

      <GuestDetailsModal 
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  title: { fontFamily: FONTS.bold, fontSize: 24, color: '#FFF', marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, color: GUESTS_THEME.textSecondary },
  
  searchRow: { flexDirection: 'row', gap: SPACING.sm },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GUESTS_THEME.card,
    borderWidth: 1,
    borderColor: GUESTS_THEME.border,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    color: '#FFF',
    height: '100%'
  },
  searchBtn: {
    height: 48,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  searchBtnTxt: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF'
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 20
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80
  },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, color: '#FFF', marginBottom: 4 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm, color: GUESTS_THEME.textSecondary },
  
  paginationWrap: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    backgroundColor: '#000000'
  }
});

export default OnDemandUsersScreen;
