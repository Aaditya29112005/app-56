import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Filter, ChevronDown, Calendar, SlidersHorizontal, Menu } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { useEventsStore } from '../../store/useEventsStore';

import EventCard from '../../components/Events/EventCard';
import FilterDropdown from '../../components/FilterDropdown';

const THEME = {
  bg: '#000000',
  card: '#1A1A1A',
  border: '#1F1F1F',
  accent: '#f97316',
};

const CATEGORIES = [
  { label: 'All Categories', value: null },
  { label: 'Networking', value: 'Networking' },
  { label: 'Education', value: 'Education' },
  { label: 'Social', value: 'Social' },
  { label: 'Workshop', value: 'Workshop' },
];

const STATUS_OPTS = [
  { label: 'All Status', value: null },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SORT_OPTS = [
  { label: 'Date (Newest First)', value: 'date_desc' },
  { label: 'Date (Oldest First)', value: 'date_asc' },
  { label: 'Title (A-Z)', value: 'title_asc' },
  { label: 'Title (Z-A)', value: 'title_desc' },
];

const EventsListScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { events, deleteEvent } = useEventsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTS[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTS[0]);

  const [activeFilter, setActiveFilter] = useState(null); // 'category', 'status', 'sort'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory.value) {
      result = result.filter(e => e.category === selectedCategory.value);
    }

    if (selectedStatus.value) {
      result = result.filter(e => e.status === selectedStatus.value);
    }

    result.sort((a, b) => {
      switch (selectedSort.value) {
        case 'date_desc': return new Date(b.start) - new Date(a.start);
        case 'date_asc': return new Date(a.start) - new Date(b.start);
        case 'title_asc': return a.title.localeCompare(b.title);
        case 'title_desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    return result;
  }, [debouncedQuery, selectedCategory, selectedStatus, selectedSort, events]);

  const handleDelete = (id) => {
    Alert.alert('Delete Event', 'Are you sure you want to permanently remove this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(id) }
    ]);
  };

  const handleEdit = (event) => {
    navigation.navigate('CreateEvent', { edit: true, event });
  };

  const handleRSVP = (event) => {
    navigation.navigate('RSVPList', { eventId: event.id, eventTitle: event.title });
  };

  const renderFilterItem = (label, value, onPress) => (
    <TouchableOpacity style={[styles.filterChip, { borderColor: THEME.border }]} onPress={onPress}>
      <Text style={styles.filterChipLabel}>{label}</Text>
      <ChevronDown size={14} color="#64748B" />
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
              <Text style={[styles.title, { color: '#FFF' }]}>Events</Text>
              <Text style={[styles.subtitle, { color: '#94A3B8' }]}>Manage your community events</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.createBtn, { backgroundColor: THEME.accent }]}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Plus size={20} color="#FFF" />
            <Text style={styles.createBtnText}>Create Event</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBox, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
          <Search size={18} color="#64748B" />
          <TextInput 
            style={[styles.searchInput, { color: '#FFF' }]}
            placeholder="Search by title, description..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersRow}>
          {renderFilterItem(selectedCategory.label, selectedCategory.value, () => setActiveFilter('category'))}
          {renderFilterItem(selectedStatus.label, selectedStatus.value, () => setActiveFilter('status'))}
          <TouchableOpacity style={[styles.filterChip, { borderColor: THEME.border }]} onPress={() => setActiveFilter('sort')}>
             <SlidersHorizontal size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList 
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onRSVP={handleRSVP}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color={THEME.border} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search.</Text>
          </View>
        }
      />

      {/* Dropdowns */}
      <FilterDropdown 
        visible={!!activeFilter}
        title={activeFilter === 'sort' ? 'Sort By' : `Select ${activeFilter}`}
        options={activeFilter === 'category' ? CATEGORIES : activeFilter === 'status' ? STATUS_OPTS : SORT_OPTS}
        selectedOption={activeFilter === 'category' ? selectedCategory : activeFilter === 'status' ? selectedStatus : selectedSort}
        onClose={() => setActiveFilter(null)}
        onSelect={(opt) => {
          if (activeFilter === 'category') setSelectedCategory(opt);
          else if (activeFilter === 'status') setSelectedStatus(opt);
          else setSelectedSort(opt);
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
  title: { fontFamily: FONTS.bold, fontSize: 28 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 13, marginTop: 4 },
  menuBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F1F1F' },
  createBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  createBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#FFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: FONTS.medium, fontSize: 14 },
  filtersRow: { flexDirection: 'row', gap: 10 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 36, borderRadius: 18, borderWidth: 1, gap: 6 },
  filterChipLabel: { fontFamily: FONTS.bold, fontSize: 12, color: '#94A3B8' },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF', marginTop: 16 },
  emptySubtitle: { fontFamily: FONTS.medium, fontSize: 14, color: '#64748B', marginTop: 4 },
});

export default EventsListScreen;
