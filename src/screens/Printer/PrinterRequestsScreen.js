import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, Building2, FileX, Plus, Menu } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';
import { usePrinterStore } from '../../store/usePrinterStore';

import RequestCard from '../../components/Printer/RequestCard';
import PrinterStatusBadge from '../../components/Printer/PrinterStatusBadge';
import FilterDropdown from '../../components/FilterDropdown';
import FileViewerModal from '../../components/Printer/FileViewerModal';

const THEME = {
  bg: '#000000',
  card: '#1A1A1A',
  border: '#1F1F1F',
  accent: '#FF8A00',
};

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Pending', value: 'pending' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PrinterRequestsScreen = ({ navigation }) => {
  const { requests, buildings, updateStatus } = usePrinterStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'status'
  const [refreshing, setRefreshing] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(r => 
        r.fileName.toLowerCase().includes(q) || 
        r.clientName.toLowerCase().includes(q)
      );
    }

    if (selectedBuilding.value) {
      result = result.filter(r => r.building === selectedBuilding.value);
    }

    if (selectedStatus.value) {
      result = result.filter(r => r.status === selectedStatus.value);
    }

    return result.sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));
  }, [debouncedQuery, selectedBuilding, selectedStatus, requests]);

  const handleStatusUpdate = (id, newStatus) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateStatus(id, newStatus);
  };

  const renderFilterTrigger = (label, icon, onPress) => (
    <TouchableOpacity style={styles.filterChip} onPress={onPress}>
      {icon}
      <Text style={styles.filterChipText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.bg }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
               <Menu size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Printer Requests</Text>
              <Text style={styles.subtitle}>Manage print jobs for clients</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreatePrinterRequest')}
          >
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Search size={18} color="#64748B" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search by file, client..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filtersRow}>
          {renderFilterTrigger(selectedBuilding.label, <Building2 size={14} color="#A0A4AE" />, () => setActiveFilter('building'))}
          {renderFilterTrigger(selectedStatus.label, <SlidersHorizontal size={14} color="#A0A4AE" />, () => setActiveFilter('status'))}
        </View>
      </View>

      {/* List */}
      <FlatList 
        data={filteredRequests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RequestCard 
            request={item} 
            onUpdateStatus={handleStatusUpdate} 
            onViewFile={setViewingFile}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FileX size={48} color={THEME.border} />
            <Text style={styles.emptyTitle}>No printer requests found</Text>
            <Text style={styles.emptySubtitle}>Upload a document to get started</Text>
          </View>
        }
      />

      <FileViewerModal 
        visible={!!viewingFile}
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />

      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'building' ? 'Select Building' : 'Select Status'}
        options={activeFilter === 'building' ? buildings : STATUS_OPTS}
        selectedOption={activeFilter === 'building' ? selectedBuilding : selectedStatus}
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'building') setSelectedBuilding(opt);
          else setSelectedStatus(opt);
          setActiveFilter(null);
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.lg, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: FONTS.bold, fontSize: 24, color: '#FFF' },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, color: '#A0A4AE', marginTop: 4 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  menuBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F1F1F' },
  searchSection: { marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: '#1A1A1A', borderRadius: 14, borderWidth: 1, borderColor: '#1F1F1F', paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14, color: '#FFF' },
  filtersRow: { flexDirection: 'row', gap: 10 },
  filterChip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1F1F1F', backgroundColor: '#1A1A1A', gap: 8 },
  filterChipText: { fontFamily: FONTS.bold, fontSize: 12, color: '#A0A4AE' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF' },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14, color: '#64748B' },
});

export default PrinterRequestsScreen;
