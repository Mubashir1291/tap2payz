import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Subtitle1 } from '../utils/fonts';
import { ApprovedIcon } from '../assets/Images';

const SuccessModal = ({ visible, onClose, message, title = 'Successful' }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={ApprovedIcon} style={styles.icon} />
          <Text style={[styles.title, H3]}>{title}</Text>
          <Text style={[styles.message, Subtitle1]}>{message}</Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
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
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    width: S(400),
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: S(80),
    height: S(80),
    marginBottom: VS(16),
  },
  title: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  message: {
    color: Colors.grey,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.grey,
    fontSize: MS(12),
  },
});

export default SuccessModal;
