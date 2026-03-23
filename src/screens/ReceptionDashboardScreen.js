import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, RefreshCw, ChevronDown, Menu } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

import StatsCard from '../components/Reception/StatsCard';
import TabSwitcher from '../components/Reception/TabSwitcher';
import VisitorCardRow from '../components/Reception/VisitorCardRow';
import FilterDropdown from '../components/FilterDropdown';
import CalendarDatePicker from '../components/Reception/CalendarDatePicker';
import CheckInModal from '../components/Reception/CheckInModal';
import VisitorDetailsModal from '../components/Reception/VisitorDetailsModal';
import { SkeletonList, SkeletonBox } from '../components/Skeleton/SkeletonLayouts';

// Mock Data
const INITIAL_VISITORS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'Acme Corp', host: 'Alice Smith', status: 'pending', visitDate: new Date().toISOString().split('T')[0], visitTime: '10:00 AM' },
  { id: '2', name: 'Jane Roe', email: 'jane@example.com', phone: '098-765-4321', company: 'Startup Inc', host: 'Bob Jones', status: 'checked_in', visitDate: new Date().toISOString().split('T')[0], visitTime: '11:00 AM' },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', phone: '112-233-4455', company: 'Pearson Specter', host: 'Harvey Specter', status: 'no_show', visitDate: '2026-03-19', visitTime: '09:00 AM' },
];

const FILTER_STATUSES = [
  { label: 'All', value: null },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Not Checked In', value: 'pending' },
];

const FILTER_CLIENTS = [
  { label: 'All Clients', value: null },
  { label: 'Acme Corp', value: 'Acme Corp' },
  { label: 'Startup Inc', value: 'Startup Inc' },
  { label: 'Pearson Specter', value: 'Pearson Specter' },
];

const FilterBtn = ({ label, value, onPress, isActive }) => {
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
        {label}{value ? `: ${value}` : ''} <ChevronDown size={14} color={isActive ? colors.primary : colors.textSecondary} style={{marginLeft: 4, marginTop: 2}} />
      </Text>
    </TouchableOpacity>
  );
};

const ReceptionDashboardScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  // State
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("Today's Visitors");
  
  // Filters
  const [activeFilterSheet, setActiveFilterSheet] = useState(null); // 'status', 'client'
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Modals
  const [checkInVisitor, setCheckInVisitor] = useState(null);
  const [detailsVisitor, setDetailsVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Stats derivation
  const totalVisitors = visitors.length;
  const invited = visitors.filter(v => v.status === 'pending').length;
  const checkedIn = visitors.filter(v => v.status === 'checked_in').length;

  const filteredData = useMemo(() => {
    let res = visitors;

    // Tabs
    const todayStr = new Date().toISOString().split('T')[0];
    if (activeTab === "Today's Visitors") {
      res = res.filter(v => v.visitDate === todayStr);
    } else if (activeTab === "Pending Requests") {
      res = res.filter(v => v.status === 'pending');
    }

    // Text Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(v => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
    }

    // Dropdowns
    if (selectedStatus?.value) {
      if (selectedStatus.value === 'pending') {
         res = res.filter(v => v.status === 'pending' || v.status === 'no_show');
      } else {
         res = res.filter(v => v.status === selectedStatus.value);
      }
    }
    if (selectedClient?.value) {
      res = res.filter(v => v.company === selectedClient.value);
    }
    if (selectedDate) {
      res = res.filter(v => v.visitDate === selectedDate);
    }

    return res;
  }, [visitors, activeTab, searchQuery, selectedStatus, selectedClient, selectedDate]);

  const handleApprove = (visitor) => {
    // In demo, pending -> approved? Prompt says "pending check-in". Just approve to checked-in for demo or leave status pending but approved flag.
    console.log("Approve", visitor.name);
  };

  const handleConfirmCheckIn = (visitor, { badgeId, notes }) => {
    setVisitors(prev => prev.map(v => v.id === visitor.id ? { ...v, status: 'checked_in', badgeId, notes } : v));
    setCheckInVisitor(null);
  };

  const getSheetOptions = () => {
    if (activeFilterSheet === 'status') return { options: FILTER_STATUSES, title: 'Check-in Status', sel: selectedStatus, set: setSelectedStatus };
    if (activeFilterSheet === 'client') return { options: FILTER_CLIENTS, title: 'Client', sel: selectedClient, set: setSelectedClient };
    return { options: [], title: '', sel: null, set: () => {} };
  };

  const sheetData = getSheetOptions();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={[styles.menuBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
               <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.pageTitle, { color: colors.text }]}>Reception</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>Manage visitor check-ins and check-outs</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}>
               <RefreshCw size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('InviteVisitor')}
            >
               <Plus size={18} color="#FFF" />
               <Text style={styles.primaryBtnText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchBox, { backgroundColor: isDark ? colors.surfaceElevated : colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, email"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stats */}
        <View style={styles.statsRow}>
          {loading ? (
            <>
              <SkeletonBox width="31%" height={80} borderRadius={16} />
              <View style={{ width: SPACING.sm }} />
              <SkeletonBox width="31%" height={80} borderRadius={16} />
              <View style={{ width: SPACING.sm }} />
              <SkeletonBox width="31%" height={80} borderRadius={16} />
            </>
          ) : (
            <>
              <StatsCard title="Total Visitors" count={totalVisitors} />
              <View style={{ width: SPACING.sm }} />
              <StatsCard title="Invited" count={invited} />
              <View style={{ width: SPACING.sm }} />
              <StatsCard title="Checked In" count={checkedIn} />
            </>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
           <TabSwitcher 
             tabs={["Today's Visitors", "Pending Requests", "All Visitors"]} 
             activeTab={activeTab} 
             onTabChange={setActiveTab} 
           />
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SPACING.md }}>
            <FilterBtn 
              label="Status" 
              value={selectedStatus?.label !== 'All' ? selectedStatus?.label : ''} 
              isActive={!!selectedStatus?.value}
              onPress={() => setActiveFilterSheet('status')} 
            />
            <FilterBtn 
              label="Client" 
              value={selectedClient?.label !== 'All Clients' ? selectedClient?.label : ''} 
              isActive={!!selectedClient?.value}
              onPress={() => setActiveFilterSheet('client')} 
            />
            <FilterBtn 
              label="Date" 
              value={selectedDate || ''} 
              isActive={!!selectedDate}
              onPress={() => setShowDatePicker(true)} 
            />
          </ScrollView>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {loading ? (
            <SkeletonList items={3} />
          ) : filteredData.length > 0 ? (
            filteredData.map(visitor => (
              <VisitorCardRow
                key={visitor.id}
                visitor={visitor}
                onRowPress={setDetailsVisitor}
                onCheckIn={setCheckInVisitor}
                onApprove={handleApprove}
                onViewDetails={setDetailsVisitor}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Search size={48} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No visitors found</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Internal Modals */}
      <FilterDropdown 
        visible={!!activeFilterSheet} 
        onClose={() => setActiveFilterSheet(null)}
        options={sheetData.options}
        title={sheetData.title}
        selectedOption={sheetData.sel}
        onSelect={sheetData.set}
      />
      
      <CalendarDatePicker 
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <CheckInModal 
        visible={!!checkInVisitor}
        visitor={checkInVisitor}
        onClose={() => setCheckInVisitor(null)}
        onConfirm={handleConfirmCheckIn}
      />

      <VisitorDetailsModal
        visible={!!detailsVisitor}
        visitor={detailsVisitor}
        onClose={() => setDetailsVisitor(null)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  headerTextWrap: { flex: 1, paddingRight: SPACING.md },
  pageTitle: { fontFamily: FONTS.bold, fontSize: 24, marginBottom: 2 },
  subtitle: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBtn: { width: 36, height: 36, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md },
  menuBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  primaryBtnText: { color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, marginLeft: 6 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 44, borderWidth: 1, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontFamily: FONTS.regular, fontSize: FONT_SIZE.md, height: '100%' },
  
  scrollContent: { paddingBottom: 100 },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  tabsWrapper: { paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  filterSection: { marginBottom: SPACING.lg, paddingLeft: SPACING.md },
  filterBtn: { flexDirection: 'row', alignItems: 'center', height: 36, borderWidth: 1, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, marginRight: SPACING.sm },
  filterBtnLabel: { fontSize: FONT_SIZE.sm },
  
  listContainer: { paddingHorizontal: SPACING.md },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md }
});

export default ReceptionDashboardScreen;
