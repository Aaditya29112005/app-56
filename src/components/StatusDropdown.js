import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { ChevronDown, Check } from 'lucide-react-native';
import { FONTS } from '../theme/typography';

const StatusDropdown = ({ selected, onSelect }) => {
  const [visible, setVisible] = useState(false);
  
  const options = ['All Status', 'Booked', 'Completed', 'Cancelled', 'Ongoing'];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.trigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>{selected || 'All Status'}</Text>
        <ChevronDown size={18} color="#64748B" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <Animated.View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                      styles.optionText, 
                      selected === item && { color: '#FF8A00', fontFamily: FONTS.bold }
                  ]}>
                    {item}
                  </Text>
                  {selected === item && <Check size={16} color="#FF8A00" />}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 140,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E2430',
    paddingHorizontal: 16,
  },
  triggerText: {
    color: '#FFF',
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 200,
    backgroundColor: '#151922',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E2430',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionText: {
    color: '#94A3B8',
    fontFamily: FONTS.medium,
    fontSize: 14,
  }
});

export default StatusDropdown;
