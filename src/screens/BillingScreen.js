import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Skeleton from '../components/Skeleton';
import Haptics from '../utils/Haptics';

const { width } = Dimensions.get('window');

const TableHeader = () => (
    <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, { flex: 1.2 }]}>Invoice #</Text>
        <Text style={[styles.columnHeader, { flex: 1 }]}>Date</Text>
        <Text style={[styles.columnHeader, { flex: 1 }]}>Amount</Text>
        <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>Status</Text>
    </View>
);

const InvoiceRow = ({ id, date, amount, status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'PAID': return COLORS.success;
            case 'PENDING': return COLORS.primary;
            case 'OVERDUE': return '#FF3B30';
            default: return COLORS.textMuted;
        }
    };

    return (
        <TouchableOpacity 
            style={styles.tableRow} 
            onPress={() => {
                Haptics.impactLight();
                // Download logic
            }}
        >
            <View style={[styles.cell, { flex: 1.2 }]}>
                <Text style={styles.primaryText}>{id}</Text>
            </View>
            <View style={[styles.cell, { flex: 1 }]}>
                <Text style={styles.secondaryText}>{date}</Text>
            </View>
            <View style={[styles.cell, { flex: 1 }]}>
                <Text style={styles.primaryText}>{amount}</Text>
            </View>
            <View style={[styles.cell, { flex: 1, alignItems: 'flex-end' }]}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() + '30' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const BillingScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const invoices = [
    { id: 'INV-2026-001', date: 'Mar 15, 2026', amount: '₹45,200', status: 'PAID' },
    { id: 'INV-2026-002', date: 'Apr 01, 2026', amount: '₹12,800', status: 'PENDING' },
    { id: 'INV-2025-098', date: 'Feb 15, 2026', amount: '₹38,000', status: 'OVERDUE' },
  ];

  return (
    <DashboardLayout 
        activeTab="Billing" 
        onTabPress={(id) => navigation.navigate(id)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Billing & Financials</Text>
          <Text style={styles.subtitle}>Manage your subscriptions and invoices</Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
          <GlassCard style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>OUTSTANDING</Text>
              <Text style={styles.summaryValue}>₹12,800</Text>
          </GlassCard>
          <GlassCard style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
              <Text style={styles.summaryValue}>₹8,42,000</Text>
          </GlassCard>
      </View>

      <Text style={styles.sectionTitle}>Invoice History</Text>
      <GlassCard style={styles.tableCard}>
        <TableHeader />
        <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading ? (
                [1,2,3].map(i => (
                    <View key={i} style={styles.skeletonRow}>
                        <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
                    </View>
                ))
            ) : (
                invoices.map((inv, idx) => (
                    <InvoiceRow key={idx} {...inv} />
                ))
            )}
        </ScrollView>
      </GlassCard>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontFamily: FONTS.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  summaryCard: {
    width: '48%',
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tableCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  columnHeader: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  secondaryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  skeletonRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});

export default BillingScreen;
