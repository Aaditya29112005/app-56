import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import ClientCard from '../components/Clients/ClientCard';
import ClientModal from '../components/Clients/ClientModal';
import ClientsFilterBar from '../components/Clients/ClientsFilterBar';
import FilterDropdown from '../components/FilterDropdown';

const MOCK_CLIENTS = [
  {
    id: '1',
    companyName: 'Acme Corp',
    type: 'business',
    kycStatus: 'verified',
    createdAt: new Date('2023-01-15').getTime(),
    billingAddress: '123 Main St, New York, NY 10001',
    contacts: [
      { name: 'John Doe', email: 'john@acmecorp.com', phone: '+1 555-0100', status: 'active' },
      { name: 'Jane Smith', email: 'jane@acmecorp.com', phone: '+1 555-0101', status: 'active' }
    ]
  },
  {
    id: '2',
    companyName: 'Bruce Wayne',
    type: 'individual',
    kycStatus: 'pending',
    createdAt: new Date('2023-06-20').getTime(),
    billingAddress: '1007 Mountain Drive, Gotham',
    contacts: [
      { name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 555-0199', status: 'active' },
      { name: 'Alfred P.', email: 'alfred@wayne.com', phone: '+1 555-0188', status: 'inactive' }
    ]
  },
  {
    id: '3',
    companyName: 'Startup Inc',
    type: 'business',
    kycStatus: 'pending',
    createdAt: new Date('2023-11-05').getTime(),
    billingAddress: '456 Innovation Blvd, San Francisco, CA',
    contacts: [
      { name: 'Alice Cooper', email: 'alice@startup.inc', phone: '+1 555-0200', status: 'active' }
    ]
  },
  {
    id: '4',
    companyName: 'Stark Industries',
    type: 'business',
    kycStatus: 'verified',
    createdAt: new Date('2022-09-10').getTime(),
    billingAddress: '200 Park Avenue, NY',
    contacts: []
  },
  {
    id: '5',
    companyName: 'Clark Kent',
    type: 'individual',
    kycStatus: 'verified',
    createdAt: new Date('2024-01-01').getTime(),
    billingAddress: '344 Clinton St, Metropolis',
    contacts: [
      { name: 'Clark Kent', email: 'clark@dailyplanet.com', phone: '+1 555-0300', status: 'active' }
    ]
  }
];

const FILTER_CONFIG = {
  type: [
    { label: 'All Types', value: null },
    { label: 'Business', value: 'business' },
    { label: 'Individual', value: 'individual' }
  ],
  kyc: [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Verified', value: 'verified' }
  ],
  sort: [
    { label: 'Company ↑', value: 'company_asc' },
    { label: 'Company ↓', value: 'company_desc' },
    { label: 'Created Date ↑', value: 'date_asc' },
    { label: 'Created Date ↓', value: 'date_desc' }
  ]
};

const ClientsScreen = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [typeFilter, setTypeFilter] = useState(null);
  const [sortFilter, setSortFilter] = useState(null);
  const [kycFilter, setKycFilter] = useState(null);

  const [activeDropdown, setActiveDropdown] = useState(null); // 'type', 'sort', 'kyc'
  const [selectedClient, setSelectedClient] = useState(null);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Derived Data
  const filteredClients = useMemo(() => {
    let result = [...MOCK_CLIENTS];

    // Search
    if (debouncedQuery.trim() !== '') {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(c => {
        const matchCompany = c.companyName.toLowerCase().includes(q);
        const matchContact = c.contacts.some(contact => 
          contact.name.toLowerCase().includes(q) || 
          contact.email.toLowerCase().includes(q) || 
          contact.phone.includes(q)
        );
        return matchCompany || matchContact;
      });
    }

    // Filters
    if (typeFilter?.value) result = result.filter(c => c.type === typeFilter.value);
    if (kycFilter?.value) result = result.filter(c => c.kycStatus === kycFilter.value);

    // Sort
    if (sortFilter?.value) {
      result.sort((a, b) => {
        switch(sortFilter.value) {
          case 'company_asc': return a.companyName.localeCompare(b.companyName);
          case 'company_desc': return b.companyName.localeCompare(a.companyName);
          case 'date_asc': return a.createdAt - b.createdAt;
          case 'date_desc': return b.createdAt - a.createdAt;
          default: return 0;
        }
      });
    }

    return result;
  }, [debouncedQuery, typeFilter, kycFilter, sortFilter]);

  const handleClearAll = () => {
    setTypeFilter(null);
    setSortFilter(null);
    setKycFilter(null);
  };

  const getDropdownData = () => {
    switch(activeDropdown) {
      case 'type': return { title: 'Customer Type', options: FILTER_CONFIG.type, selected: typeFilter, onSelect: (opt) => setTypeFilter(opt.value ? opt : null) };
      case 'kyc': return { title: 'KYC Status', options: FILTER_CONFIG.kyc, selected: kycFilter, onSelect: (opt) => setKycFilter(opt.value ? opt : null) };
      case 'sort': return { title: 'Sort By', options: FILTER_CONFIG.sort, selected: sortFilter, onSelect: (opt) => setSortFilter(opt) };
      default: return { title: '', options: [], selected: null, onSelect: () => {} };
    }
  };

  const dropdownData = getDropdownData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Clients & Members</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Building clients linked to your workspace</Text>
        
        <View style={[styles.searchWrap, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by company, contact, email..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ClientsFilterBar 
        typeFilter={typeFilter}
        sortFilter={sortFilter}
        kycFilter={kycFilter}
        onTypePress={() => setActiveDropdown('type')}
        onSortPress={() => setActiveDropdown('sort')}
        onKycPress={() => setActiveDropdown('kyc')}
        onClearAll={handleClearAll}
      />

      <FlatList
        data={filteredClients}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ClientCard client={item} onView={setSelectedClient} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Search size={48} color={colors.border} style={{marginBottom: SPACING.md}} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No clients found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting your search or filters.</Text>
          </View>
        }
      />

      <FilterDropdown 
        visible={!!activeDropdown}
        title={dropdownData.title}
        options={dropdownData.options}
        selectedOption={dropdownData.selected || dropdownData.options[0]}
        onClose={() => setActiveDropdown(null)}
        onSelect={(opt) => { dropdownData.onSelect(opt); setActiveDropdown(null); }}
      />

      <ClientModal 
        visible={!!selectedClient}
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xs },
  title: { fontFamily: FONTS.bold, fontSize: 24, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs, marginBottom: SPACING.md },
  searchWrap: { flexDirection: 'row', alignItems: 'center', height: 44, borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 100, paddingTop: SPACING.sm },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, marginBottom: 4 },
  emptySubtitle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm }
});

export default ClientsScreen;
