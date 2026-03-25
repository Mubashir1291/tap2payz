import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Subtitle1, ButtonText } from '../utils/fonts';
import { DeleteTableIcon } from '../assets/Images';

const DeleteTableModal = ({ visible, onClose, onDelete }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H3]}>Delete Table</Text>

          <View style={styles.iconContainer}>
            <Image source={DeleteTableIcon} style={styles.icon} />
          </View>

          <Text style={[styles.message, Subtitle1]}>
            Are you sure you want to delete this Table?{'\n'}
            your all data will be lost.
          </Text>

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={[styles.deleteBtnText, ButtonText]}>Delete Table</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F0F0F0',
    borderRadius: MS(20),
    padding: MS(32),
    width: S(450),
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    backgroundColor: '#FF4C3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.white,
    fontSize: MS(12),
    fontWeight: 'bold',
  },
  title: {
    color: '#333',
    marginBottom: VS(24),
    fontWeight: '600',
  },
  iconContainer: {
    width: S(120),
    height: S(120),
    borderRadius: S(60),
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VS(24),
  },
  icon: {
    width: S(80),
    height: S(80),
    resizeMode: 'contain',
  },
  message: {
    color: '#333',
    textAlign: 'center',
    marginBottom: VS(32),
    lineHeight: VS(22),
  },
  deleteBtn: {
    backgroundColor: '#D94326',
    paddingVertical: VS(14),
    paddingHorizontal: S(40),
    borderRadius: MS(12),
    width: '80%',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.white,
  },
});

export default DeleteTableModal;
