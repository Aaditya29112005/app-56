import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import { SPACING } from '../theme/spacing';

const NAV_ITEMS = [
  { id: 'MainTabs', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'Tickets', label: 'Tickets', icon: 'ticket-outline' },
  { id: 'Reception', label: 'Reception', icon: 'business-outline' },
  { id: 'Cards', label: 'Cards', icon: 'card-outline' },
  { id: 'Clients', label: 'Clients', icon: 'people-outline' },
  { id: 'Leads', label: 'Leads', icon: 'trending-up-outline' },
  { id: 'OnDemandUsers', label: 'On-demand Users', icon: 'person-outline' },
  { id: 'Bookings', label: 'Bookings', icon: 'calendar-outline', hasSubmenu: true, subItems: [
    { id: 'BookDayPass', label: 'Day Pass' },
    { id: 'DayPassBookings', label: 'Day Pass Bookings' },
    { id: 'MeetingRoomBookings', label: 'Meeting Room Bookings' },
  ]},
  { id: 'Events', label: 'Events', icon: 'megaphone-outline' },
  { id: 'PrinterRequests', label: 'Printer Requests', icon: 'print-outline' },
  { id: 'Inventory', label: 'Inventory', icon: 'layers-outline', hasSubmenu: true, subItems: [
    { id: 'Cabins', label: 'Cabins' },
    { id: 'MeetingRoomsInventory', label: 'Meeting Rooms' },
    { id: 'CommonAreas', label: 'Common Areas' },
  ]},
];

const Sidebar = ({ activeTab, onTabPress, isCollapsed, onToggleCollapse }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = React.useState('Bookings');

  return (
    <View style={[
      styles.container, 
      isCollapsed && styles.containerCollapsed, 
      { 
        backgroundColor: colors.surface, 
        borderRightColor: colors.border,
        paddingTop: Math.max(insets.top, SPACING.lg) 
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSlot}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>O</Text>
          </View>
          {!isCollapsed && <Text style={[styles.logoText, { color: colors.text }]}>OFISSQUARE</Text>}
        </View>
        <TouchableOpacity 
          style={styles.collapseBtn} 
          onPress={onToggleCollapse}
        >
          <Icon name={isCollapsed ? 'chevron-forward' : 'chevron-back'} size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id || 
                           (item.hasSubmenu && item.subItems?.some(sub => sub.id === activeTab)) ||
                           (item.id === 'Events' && (activeTab === 'Events' || activeTab === 'EventsList' || activeTab === 'CreateEvent' || activeTab === 'RSVPList')) ||
                           (item.id === 'PrinterRequests' && (activeTab === 'PrinterRequests' || activeTab === 'PrinterRequestsList' || activeTab === 'CreatePrinterRequest')) ||
                           (item.id === 'MeetingRoomsInventory' && (activeTab === 'MeetingRoomsInventory' || activeTab === 'MeetingRooms' || activeTab === 'CreateMeetingBooking')) ||
                           (item.id === 'Inventory' && (activeTab === 'CommonAreas' || activeTab === 'Cabins' || activeTab === 'MeetingRoomsInventory'));
          
          return (
            <View key={item.id} style={styles.itemWrapper}>
              <TouchableOpacity
                style={[
                  styles.navItem,
                  isActive && { backgroundColor: COLORS.primary + '12' },
                  isCollapsed && styles.navItemCollapsed
                ]}
                onPress={() => {
                  if (item.hasSubmenu) {
                    setExpanded(expanded === item.id ? null : item.id);
                  } else {
                    onTabPress(item.id);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, isActive && { backgroundColor: COLORS.primary + '18' }]}>
                  <Icon 
                    name={isActive ? item.icon.replace('-outline', '') : item.icon} 
                    size={18} 
                    color={isActive ? COLORS.primary : colors.textMuted} 
                  />
                </View>
                {!isCollapsed && (
                  <>
                    <Text style={[
                      styles.navLabel,
                      { color: isActive ? COLORS.primary : colors.textSecondary },
                      isActive && { fontFamily: FONTS.semibold }
                    ]}>
                      {item.label}
                    </Text>
                    {item.hasSubmenu && (
                      <Icon 
                        name={expanded === item.id ? 'remove' : 'add'} 
                        size={16} 
                        color={isActive ? COLORS.primary : colors.textMuted} 
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>
              
              {!isCollapsed && item.hasSubmenu && expanded === item.id && item.subItems && (
                <View style={styles.submenu}>
                  {item.subItems.map((sub) => (
                    <TouchableOpacity 
                      key={sub.id} 
                      style={styles.submenuItem}
                      onPress={() => onTabPress(sub.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.submenuDot, { backgroundColor: activeTab === sub.id ? COLORS.primary : colors.border }]} />
                      <Text style={[
                        styles.submenuLabel, 
                        { color: activeTab === sub.id ? colors.text : colors.textSecondary }, 
                        activeTab === sub.id && { fontFamily: FONTS.semibold }
                      ]}>
                        {sub.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.glassBackground }]} activeOpacity={0.7}>
          <Icon name="log-out-outline" size={18} color={colors.textSecondary} />
          {!isCollapsed && <Text style={[styles.logoutText, { color: colors.textSecondary }]}>Logout</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    borderRightWidth: 1,
    width: 260,
  },
  containerCollapsed: {
    width: 72,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoMarkText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  logoText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 2,
  },
  collapseBtn: {
    width: 22,
    height: 22,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -11,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  itemWrapper: {
    marginBottom: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.sm,
    borderRadius: 10,
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  navLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  submenu: {
    paddingLeft: 54,
    marginTop: 2,
    marginBottom: 6,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  submenuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  submenuLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
});

export default Sidebar;
