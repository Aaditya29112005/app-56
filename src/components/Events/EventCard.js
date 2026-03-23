import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';
import { Calendar, MapPin, Users, Edit2, Trash2, ChevronRight } from 'lucide-react-native';
import StatusBadge from './StatusBadge';

const EventCard = ({ event, onEdit, onDelete, onRSVP }) => {
  const { colors, isDark } = useTheme();

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#151922' : colors.card, borderColor: isDark ? '#1E2430' : colors.border }]}>
      
      <View style={styles.header}>
        <View style={styles.titleArea}>
           <Text style={[styles.title, { color: '#FFF' }]}>{event.title}</Text>
           <View style={[styles.categoryTag, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
             <Text style={styles.categoryText}>{event.category}</Text>
           </View>
        </View>
        <StatusBadge status={event.status} />
      </View>

      <Text style={[styles.desc, { color: '#94A3B8' }]} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.metaText}>{formatDateTime(event.start)}</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: isDark ? '#1E2430' : colors.border }]}>
        <TouchableOpacity style={styles.rsvpBtn} onPress={() => onRSVP(event)}>
          <Users size={16} color="#F97316" />
          <Text style={styles.rsvpBtnText}>View RSVPs</Text>
        </TouchableOpacity>
        
        <View style={styles.actionGroup}>
           <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(event)}>
             <Edit2 size={16} color="#94A3B8" />
           </TouchableOpacity>
           <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(event.id)}>
             <Trash2 size={16} color="#EF4444" />
           </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleArea: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 6,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#F97316',
    textTransform: 'uppercase',
  },
  desc: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  rsvpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rsvpBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#F97316',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
});

export default EventCard;
