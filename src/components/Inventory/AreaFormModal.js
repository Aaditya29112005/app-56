import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Switch,
  LayoutAnimation
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const DEVICE_OPTIONS = ['Camera', 'AC', 'Lights', 'Speaker', 'Access Control'];

const AreaFormModal = ({ visible, area, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    building: 'Sohna Road Gurugram',
    type: 'LOBBY',
    description: '',
    status: 'ACTIVE',
    devices: []
  });

  useEffect(() => {
    if (area) {
      setFormData(area);
    } else {
      setFormData({
        name: '',
        building: 'Sohna Road Gurugram',
        type: 'LOBBY',
        description: '',
        status: 'ACTIVE',
        devices: []
      });
    }
  }, [area, visible]);

  const toggleDevice = (device) => {
    const newDevices = formData.devices.includes(device)
      ? formData.devices.filter(d => d !== device)
      : [...formData.devices, device];
    setFormData({ ...formData, devices: newDevices });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{area ? 'Edit Common Area' : 'New Common Area'}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
            <View style={styles.section}>
              <Text style={styles.label}>Area Name</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Executive Lounge"
                placeholderTextColor="#64748B"
                value={formData.name}
                onChangeText={(v) => setFormData({ ...formData, name: v })}
              />
            </View>

            <View style={styles.row}>
               <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.input}>
                     <Text style={{ color: '#FFF' }}>{formData.type}</Text>
                  </View>
               </View>
               <View style={{ width: 12 }} />
               <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Status</Text>
                  <View style={styles.statusRow}>
                     <Text style={[styles.statusText, { color: formData.status === 'ACTIVE' ? '#F97316' : '#64748B' }]}>
                        {formData.status}
                     </Text>
                     <Switch 
                        value={formData.status === 'ACTIVE'}
                        onValueChange={(v) => setFormData({ ...formData, status: v ? 'ACTIVE' : 'INACTIVE' })}
                        trackColor={{ true: '#F97316', false: '#334155' }}
                     />
                  </View>
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.label}>Environment Devices</Text>
               <View style={styles.deviceGrid}>
                  {DEVICE_OPTIONS.map(dev => (
                    <TouchableOpacity 
                      key={dev} 
                      style={[styles.deviceChip, formData.devices.includes(dev) && styles.deviceChipActive]}
                      onPress={() => toggleDevice(dev)}
                    >
                       <Text style={[styles.deviceChipText, formData.devices.includes(dev) && { color: '#FFF' }]}>{dev}</Text>
                    </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.label}>Description</Text>
               <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                  placeholder="Tell us about this area..."
                  placeholderTextColor="#64748B"
                  multiline
                  value={formData.description}
                  onChangeText={(v) => setFormData({ ...formData, description: v })}
               />
            </View>
          </ScrollView>

          <View style={styles.footer}>
             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Check size={18} color="#FFF" />
                <Text style={styles.saveText}>Save Area</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  content: { 
    height: '85%', 
    backgroundColor: '#000000', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 24,
    borderWidth: 1,
    borderColor: '#1F1F1F'
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: FONTS.bold, fontSize: 22, color: '#FFF' },
  body: { flex: 1 },
  section: { marginBottom: 20 },
  label: { fontFamily: FONTS.bold, fontSize: 12, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { 
    height: 52, 
    backgroundColor: '#1A1A1A', 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    fontFamily: FONTS.medium, 
    fontSize: 14, 
    color: '#FFF',
    justifyContent: 'center'
  },
  row: { flexDirection: 'row', marginBottom: 20 },
  statusRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    height: 52, 
    backgroundColor: '#1A1A1A', 
    borderRadius: 14, 
    paddingHorizontal: 16 
  },
  statusText: { fontFamily: FONTS.bold, fontSize: 13 },
  deviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  deviceChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0F172A' },
  deviceChipActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  deviceChipText: { fontFamily: FONTS.bold, fontSize: 12, color: '#94A3B8' },
  footer: { flexDirection: 'row', gap: 12, paddingTop: 20 },
  cancelBtn: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: FONTS.bold, fontSize: 15, color: '#94A3B8' },
  saveBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  saveText: { fontFamily: FONTS.bold, fontSize: 15, color: '#FFF' },
});

export default AreaFormModal;
