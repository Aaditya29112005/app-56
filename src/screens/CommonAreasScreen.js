import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  useWindowDimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Building2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Plus, 
  Info,
  Layers,
  ChevronRight,
  Menu
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { useCommonAreaStore } from '../store/useCommonAreaStore';

import CommonAreaCard from '../components/Inventory/CommonAreaCard';
import CommonAreaStatusBadge from '../components/Inventory/CommonAreaStatusBadge';
import AreaFormModal from '../components/Inventory/AreaFormModal';
import FilterDropdown from '../components/FilterDropdown';
import Haptics from '../utils/Haptics';

const THEME = {
  bg: '#000000',
  card: '#1A1A1A',
  border: '#1F1F1F',
  accent: '#F97316',
};

const BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'Sohna Road Gurugram', value: 'Sohna Road Gurugram' },
  { label: 'Test - Gurugram', value: 'Test - Gurugram' },
  { label: 'Ofis Test', value: 'Ofis Test' },
];

const TYPES = [
  { label: 'All Types', value: null },
  { label: 'CAFETERIA', value: 'CAFETERIA' },
  { label: 'CORRIDOR', value: 'CORRIDOR' },
  { label: 'LOBBY', value: 'LOBBY' },
  { label: 'PANTRY', value: 'PANTRY' },
  { label: 'LOUNGE', value: 'LOUNGE' },
];

const SORT_OPTS = [
  { label: 'Name ↑', value: 'name_asc' },
  { label: 'Name ↓', value: 'name_desc' },
  { label: 'Building ↑', value: 'build_asc' },
  { label: 'Building ↓', value: 'build_desc' },
  { label: 'Type ↑', value: 'type_asc' },
];

const CommonAreasScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const { areas, loading, fetchAreas, addArea, updateArea, deleteArea, toggleStatus } = useCommonAreaStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'building', 'type', 'sort'
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactLight();
    fetchAreas().then(() => setRefreshing(false));
  }, []);

  const filteredAreas = useMemo(() => {
    let result = [...areas];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.building.toLowerCase().includes(q)
      );
    }

    if (selectedBuilding.value) result = result.filter(a => a.building === selectedBuilding.value);
    if (selectedType.value) result = result.filter(a => a.type === selectedType.value);

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'build_asc': return a.building.localeCompare(b.building);
        case 'type_asc': return a.type.localeCompare(b.type);
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedBuilding, selectedType, selectedSort, areas]);

  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedBuilding(BUILDINGS[0]);
    setSelectedType(TYPES[0]);
    setSearchQuery('');
  };

  const handleSave = async (data) => {
    if (editingArea) {
      await updateArea(editingArea.id, data);
    } else {
      await addArea(data);
    }
    setModalVisible(false);
    setEditingArea(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Area', 'Are you sure you want to remove this common area?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteArea(id) }
    ]);
  };

  const renderFilterItem = (label, value, icon, onPress) => (
    <TouchableOpacity style={styles.filterChip} onPress={onPress}>
      {icon}
      <Text style={styles.filterChipText}>{value || label}</Text>
    </TouchableOpacity>
  );

  const TableHeader = () => (
    <View style={styles.tableRow}>
       <Text style={[styles.col, styles.colName]}>NAME</Text>
       <Text style={[styles.col, styles.colBuild]}>BUILDING</Text>
       <Text style={[styles.col, styles.colType]}>TYPE</Text>
       <Text style={[styles.col, styles.colDev]}>DEVICES</Text>
       <Text style={[styles.col, styles.colStatus]}>STATUS</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()}
              style={styles.menuBtn}
            >
               <Menu size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Common Areas</Text>
              <Text style={styles.subtitle}>Manage your common areas and device access</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => {
              setEditingArea(null);
              setModalVisible(true);
            }}
          >
             <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
           <View style={styles.searchBox}>
              <Search size={18} color="#64748B" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search by name, building..."
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
           </View>
        </View>

        <View style={styles.filtersContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {renderFilterItem('Building', selectedBuilding.label, <Building2 size={14} color="#A0A4AE" />, () => setActiveFilter('building'))}
              {renderFilterItem('Type', selectedType.label, <Layers size={14} color="#A0A4AE" />, () => setActiveFilter('type'))}
              {renderFilterItem('Sort', selectedSort.label, <ArrowUpDown size={14} color="#A0A4AE" />, () => setActiveFilter('sort'))}
           </ScrollView>
        </View>
      </View>

      {/* Result Meta */}
      <View style={styles.metaRow}>
         <View style={styles.metaLeft}>
            <Text style={styles.countText}>Showing {filteredAreas.length} of {areas.length} zones</Text>
         </View>
         {(selectedBuilding.value || selectedType.value || searchQuery) && (
           <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
           </TouchableOpacity>
         )}
      </View>

      {/* List / Table */}
      {isTablet ? (
        <ScrollView style={styles.tableContainer} contentContainerStyle={{ paddingBottom: 100 }}>
           <TableHeader />
           {filteredAreas.map((area, idx) => (
             <TouchableOpacity 
               key={area.id} 
               style={[styles.tableRow, styles.tableDataRow]}
               onPress={() => { setEditingArea(area); setModalVisible(true); }}
             >
                <Text style={[styles.col, styles.colName, styles.tableDataText]}>{area.name}</Text>
                <Text style={[styles.col, styles.colBuild, styles.tableDataText]}>{area.building}</Text>
                <Text style={[styles.col, styles.colType, styles.tableDataText]}>{area.type}</Text>
                <Text style={[styles.col, styles.colDev, styles.tableDataText]}>{area.devices?.length || 0}</Text>
                <View style={[styles.col, styles.colStatus]}>
                   <CommonAreaStatusBadge status={area.status} />
                </View>
             </TouchableOpacity>
           ))}
        </ScrollView>
      ) : (
        <FlatList 
          data={loading ? [1,2,3] : filteredAreas}
          keyExtractor={(item, index) => loading ? `skeleton-${index}` : item.id}
          renderItem={({ item }) => (
            loading ? (
              <View style={styles.skeletonCard} />
            ) : (
              <CommonAreaCard 
                area={item} 
                onEdit={(a) => { setEditingArea(a); setModalVisible(true); }} 
                onDelete={handleDelete}
                onToggleStatus={toggleStatus}
              />
            )
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Info size={48} color="#232734" />
              <Text style={styles.emptyTitle}>No areas found</Text>
              <Text style={styles.emptySubtitle}>Adjust your filters to see more results.</Text>
            </View>
          }
        />
      )}

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={`Select ${activeFilter}`}
        options={
          activeFilter === 'building' ? BUILDINGS : 
          activeFilter === 'type' ? TYPES : SORT_OPTS
        }
        selectedOption={
          activeFilter === 'building' ? selectedBuilding : 
          activeFilter === 'type' ? selectedType : selectedSort
        }
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          if (activeFilter === 'building') setSelectedBuilding(opt);
          else if (activeFilter === 'type') setSelectedType(opt);
          else setSelectedSort(opt);
          setActiveFilter(null);
        }}
      />

      {/* Form Modal */}
      <AreaFormModal 
        visible={modalVisible}
        area={editingArea}
        onClose={() => { setModalVisible(false); setEditingArea(null); }}
        onSave={handleSave}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  header: { padding: SPACING.lg, gap: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: FONTS.bold, fontSize: 24, color: '#FFF' },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, color: '#94A3B8', marginTop: 4 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
  menuBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  searchRow: { marginTop: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: '#1E293B', borderRadius: 14, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14, color: '#FFF' },
  filtersContainer: { marginTop: 4 },
  filtersScroll: { gap: 10, paddingRight: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827', gap: 8 },
  filterChipText: { fontFamily: FONTS.bold, fontSize: 12, color: '#94A3B8' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: 12 },
  countText: { fontFamily: FONTS.medium, fontSize: 12, color: '#64748B' },
  clearBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#F97316' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  skeletonCard: { height: 160, backgroundColor: '#1E293B', borderRadius: 18, marginBottom: 16, opacity: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF' },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14, color: '#64748B' },
  
  // Tablet Table Styles
  tableContainer: { paddingHorizontal: SPACING.lg },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  tableDataRow: { paddingVertical: 16 },
  col: { fontFamily: FONTS.bold, fontSize: 11, color: '#64748B', letterSpacing: 1 },
  tableDataText: { fontSize: 13, color: '#FFF', fontFamily: FONTS.medium, letterSpacing: 0 },
  colName: { flex: 2 },
  colBuild: { flex: 1.5 },
  colType: { flex: 1 },
  colDev: { flex: 0.8, textAlign: 'center' },
  colStatus: { flex: 1, alignItems: 'center' },
});

export default CommonAreasScreen;
