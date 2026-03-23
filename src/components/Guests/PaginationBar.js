import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { FONTS, FONT_SIZE } from '../../theme/typography';
import { SPACING, BORDER_RADIUS } from '../../theme/spacing';

const GUESTS_THEME = {
  bg: '#000000',
  card: '#151922',
  border: '#1E2430',
  textSecondary: '#9CA3AF'
};

const PaginationBar = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.btn, currentPage === 1 && styles.btnDisabled]} 
        disabled={currentPage === 1}
        onPress={onPrev}
      >
        <ChevronLeft size={16} color={currentPage === 1 ? '#4B5563' : '#FFF'} />
        <Text style={[styles.btnText, currentPage === 1 && { color: '#4B5563' }]}>Prev</Text>
      </TouchableOpacity>

      <Text style={styles.pageText}>
        Page <Text style={{color: '#FFF', fontFamily: FONTS.bold}}>{currentPage}</Text> of {totalPages}
      </Text>

      <TouchableOpacity 
        style={[styles.btn, currentPage === totalPages && styles.btnDisabled]} 
        disabled={currentPage === totalPages}
        onPress={onNext}
      >
        <Text style={[styles.btnText, currentPage === totalPages && { color: '#4B5563' }]}>Next</Text>
        <ChevronRight size={16} color={currentPage === totalPages ? '#4B5563' : '#FFF'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: GUESTS_THEME.border,
    marginTop: SPACING.sm
  },
  pageText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: GUESTS_THEME.textSecondary
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: GUESTS_THEME.card,
    borderWidth: 1,
    borderColor: GUESTS_THEME.border
  },
  btnDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  btnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: '#FFF',
    marginHorizontal: 4
  }
});

export default PaginationBar;
