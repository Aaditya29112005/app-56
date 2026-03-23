import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import { BORDER_RADIUS } from '../../theme/spacing';

const ActionButtons = ({ booking, onAction }) => {
  const { colors } = useTheme();

  const ActionBtn = ({ label, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionBtn label="View Visitors" color="#4B5563" onPress={() => onAction('VIEW_VISITORS', booking)} />
        <ActionBtn label="Give Access" color="#10B981" onPress={() => onAction('GIVE_ACCESS', booking)} />
      </View>
      <View style={[styles.row, { marginTop: 4 }]}>
        <ActionBtn label="Assign Card" color="#F97316" onPress={() => onAction('ASSIGN_CARD', booking)} />
        <ActionBtn label="Add Visitor" color="#3B82F6" onPress={() => onAction('ADD_VISITOR', booking)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  btn: {
    flex: 1,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  btnText: {
    fontFamily: FONTS.bold,
    fontSize: 8,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default ActionButtons;
