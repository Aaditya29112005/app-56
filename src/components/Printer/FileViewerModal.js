import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { X, Download, FileText } from 'lucide-react-native';
import { FONTS } from '../../theme/typography';
import { SPACING } from '../../theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FileViewerModal = ({ visible, file, onClose }) => {
  if (!file) return null;

  const isImage = file.fileName.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FileText size={20} color="#F97316" />
              <Text style={styles.title} numberOfLines={1}>{file.fileName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isImage ? (
              <Image source={{ uri: file.fileUrl }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <View style={styles.pdfPlaceholder}>
                <FileText size={64} color="#232734" />
                <Text style={styles.placeholderText}>PDF View Not Available in Mock</Text>
                <Text style={styles.placeholderSub}>Click download to view original file</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.downloadBtn}>
               <Download size={20} color="#FFF" />
               <Text style={styles.downloadText}>Download File</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#000000', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: SCREEN_HEIGHT * 0.85 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: '#232734' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  title: { fontFamily: FONTS.bold, fontSize: 16, color: '#FFF' },
  closeBtn: { padding: 4 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg, backgroundColor: '#1A1A1A' },
  previewImage: { width: '100%', height: '100%', borderRadius: 12 },
  pdfPlaceholder: { alignItems: 'center', gap: 16 },
  placeholderText: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFF' },
  placeholderSub: { fontFamily: FONTS.medium, fontSize: 14, color: '#64748B' },
  footer: { padding: SPACING.lg, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#232734' },
  downloadBtn: { height: 56, backgroundColor: '#F97316', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  downloadText: { fontFamily: FONTS.bold, fontSize: 16, color: '#FFF' },
});

export default FileViewerModal;
