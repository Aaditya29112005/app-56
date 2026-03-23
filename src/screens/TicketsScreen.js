import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import DashboardLayout from '../components/DashboardLayout';
import TicketCard from '../components/TicketCard';
import FilterDropdown from '../components/FilterDropdown';

const { width } = Dimensions.get('window');

// MOCK DATA
const MOCK_TICKETS = [
  {
    id: 'TCK-001',
    subject: 'AC Not cooling in Meeting Room A',
    description: 'The AC unit is blowing warm air since yesterday. Need urgent fix.',
    priority: 'Urgent',
    status: 'Open',
    client: 'Acme Corp',
    building: 'Alpha Tower',
    assignedTo: 'John Technician',
    category: 'Electricity',
    subcategory: 'Appliance',
    attachments: [],
    createdAt: 'Mar 20, 2026',
    updatedAt: 'Mar 20, 2026',
  },
  {
    id: 'TCK-002',
    subject: 'Coffee machine out of beans',
    description: 'Pantry coffee machine on floor 3 is completely out of beans.',
    priority: 'Medium',
    status: 'In Progress',
    client: 'Internal',
    building: 'Beta Hub',
    assignedTo: 'Facilities Team',
    category: 'Pantry',
    subcategory: 'Supplies',
    attachments: [],
    createdAt: 'Mar 19, 2026',
    updatedAt: 'Mar 19, 2026',
  },
  {
    id: 'TCK-003',
    subject: 'Request for Extra Desk',
    description: 'We have a new hire joining next week and need an extra desk setup in our cabin.',
    priority: 'Low',
    status: 'Pending',
    client: 'Startup Inc',
    building: 'Alpha Tower',
    assignedTo: 'Operations',
    category: 'Furniture',
    subcategory: 'Desk',
    attachments: [],
    createdAt: 'Mar 18, 2026',
    updatedAt: 'Mar 18, 2026',
  },
  {
    id: 'TCK-004',
    subject: 'Leaking faucet in washroom',
    description: 'The sink on the right in the men\'s washroom is leaking constantly.',
    priority: 'High',
    status: 'Resolved',
    client: 'Internal',
    building: 'Alpha Tower',
    assignedTo: 'Plumbing',
    category: 'Cleaning',
    subcategory: 'Washroom',
    attachments: [],
    createdAt: 'Mar 15, 2026',
    updatedAt: 'Mar 16, 2026',
  }
];

const FilterButton = ({ label, value, onPress, isActive }) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.filterBtn, 
        { 
          backgroundColor: isActive ? `${colors.primary}15` : (isDark ? colors.surfaceElevated : colors.surface),
          borderColor: isActive ? colors.primary : colors.border,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterBtnLabel, 
        { 
          color: isActive ? colors.primary : colors.textSecondary,
          fontFamily: isActive ? FONTS.bold : FONTS.medium
        }
      ]}>
        {label}{value ? `: ${value}` : ''} <Icon name="chevron-down-outline" size={14} />
      </Text>
    </TouchableOpacity>
  );
};

const TicketsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterSheet, setActiveFilterSheet] = useState(null); // 'status', 'priority', 'building', 'sort'
  
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedSort, setSelectedSort] = useState({ label: 'Newest', value: 'newest' });

  // Filter options
  const statusOptions = [
    { label: 'All', value: null },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];
  
  const priorityOptions = [
    { label: 'All', value: null },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const buildingOptions = [
    { label: 'All Buildings', value: null },
    { label: 'Alpha Tower', value: 'Alpha Tower' },
    { label: 'Beta Hub', value: 'Beta Hub' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Priority (High to Low)', value: 'priority' },
  ];

  // Filtering Logic
  const filteredTickets = useMemo(() => {
    let result = MOCK_TICKETS;
    
    // Text Search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.subject.toLowerCase().includes(lowerQ) || 
        t.id.toLowerCase().includes(lowerQ) ||
        t.client.toLowerCase().includes(lowerQ)
      );
    }
    
    // Status
    if (selectedStatus?.value) {
      result = result.filter(t => t.status === selectedStatus.value);
    }
    
    // Priority
    if (selectedPriority?.value) {
      result = result.filter(t => t.priority === selectedPriority.value);
    }
    
    // Building
    if (selectedBuilding?.value) {
      result = result.filter(t => t.building === selectedBuilding.value);
    }

    // Sorting (Mock implementation just reversing for demo if needed)
    if (selectedSort?.value === 'oldest') {
      result = [...result].reverse(); // Fake sort
    }

    return result;
  }, [searchQuery, selectedStatus, selectedPriority, selectedBuilding, selectedSort]);

  const getSheetOptions = () => {
    switch(activeFilterSheet) {
      case 'status': return { options: statusOptions, title: 'Filter by Status', selected: selectedStatus, onSelect: setSelectedStatus };
      case 'priority': return { options: priorityOptions, title: 'Filter by Priority', selected: selectedPriority, onSelect: setSelectedPriority };
      case 'building': return { options: buildingOptions, title: 'Filter by Building', selected: selectedBuilding, onSelect: setSelectedBuilding };
      case 'sort': return { options: sortOptions, title: 'Sort Tickets', selected: selectedSort, onSelect: setSelectedSort };
      default: return { options: [], title: '', selected: null, onSelect: () => {} };
    }
  };

  const sheetData = getSheetOptions();

  return (
    <DashboardLayout 
        activeTab="Tickets" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <View style={styles.topHeader}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Tickets</Text>
          <View style={[styles.countBadge, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{filteredTickets.length}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateTicket')}
        >
          <Icon name="add-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Icon name="search-outline" size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search subject, ID..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SPACING.md }}>
          <FilterButton 
            label="Sort" 
            value={selectedSort?.value === 'newest' ? '' : selectedSort?.label} 
            isActive={!!selectedSort && selectedSort.value !== 'newest'}
            onPress={() => setActiveFilterSheet('sort')} 
          />
          <FilterButton 
            label="Status" 
            value={selectedStatus?.label} 
            isActive={!!selectedStatus?.value}
            onPress={() => setActiveFilterSheet('status')} 
          />
          <FilterButton 
            label="Priority" 
            value={selectedPriority?.label}
            isActive={!!selectedPriority?.value} 
            onPress={() => setActiveFilterSheet('priority')} 
          />
          <FilterButton 
            label="Building" 
            value={selectedBuilding?.label}
            isActive={!!selectedBuilding?.value} 
            onPress={() => setActiveFilterSheet('building')} 
          />
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              onPress={() => navigation.navigate('TicketDetails', { ticket })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="cube-outline" size={48} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No tickets found</Text>
            <Text style={[styles.emptyStateDesc, { color: colors.textMuted }]}>Try adjusting your filters or search query.</Text>
            
            <TouchableOpacity 
              style={[styles.resetBtn, { borderColor: colors.primary }]}
              onPress={() => {
                setSearchQuery('');
                setSelectedStatus(null);
                setSelectedPriority(null);
                setSelectedBuilding(null);
              }}
            >
              <Text style={[styles.resetBtnText, { color: colors.primary }]}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <FilterDropdown 
        visible={!!activeFilterSheet}
        onClose={() => setActiveFilterSheet(null)}
        options={sheetData.options}
        title={sheetData.title}
        selectedOption={sheetData.selected}
        onSelect={sheetData.onSelect}
      />

    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pageTitle: {
    fontFamily: FONTS.bold,
    fontSize: 28,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  countText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchSection: {
    marginBottom: SPACING.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    height: '100%',
  },
  filterSection: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
  },
  filterBtn: {
    height: 36,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  filterBtnLabel: {
    fontSize: FONT_SIZE.sm,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  resetBtn: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  resetBtnText: {
    fontFamily: FONTS.semibold,
    fontSize: FONT_SIZE.sm,
  }
});

export default TicketsScreen;
