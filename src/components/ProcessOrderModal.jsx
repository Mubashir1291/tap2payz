import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Body1, ButtonText } from '../utils/fonts';
import { ApprovedIcon } from '../assets/Images';

const ProcessOrderModal = ({ visible, onClose, orderNumber = '1254632', onPrintBill }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Image source={ApprovedIcon} style={styles.icon} />

          <Text style={[styles.title, H3]}>Order Processing!</Text>

          <Text style={[styles.message, Body1]}>
            Your order #{orderNumber} and it's currently being prepared in the kitchen.
          </Text>

          <TouchableOpacity style={styles.printBtn} onPress={onPrintBill}>
            <Text style={[styles.printBtnText, ButtonText]}>Print bill</Text>
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
    borderRadius: MS(24),
    padding: MS(32),
    width: S(500),
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(30),
    height: S(30),
    borderRadius: S(15),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.grey,
    fontSize: MS(14),
  },
  icon: {
    width: S(100),
    height: S(100),
    marginBottom: VS(24),
    resizeMode: 'contain',
  },
  title: {
    color: Colors.black,
    marginBottom: VS(16),
    textAlign: 'center',
  },
  message: {
    color: Colors.black,
    textAlign: 'center',
    marginBottom: VS(32),
    lineHeight: VS(24),
  },
  printBtn: {
    backgroundColor: '#C6CDEF',
    width: '100%',
    height: VS(56),
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  printBtnText: {
    color: '#3E468A',
  },
});

export default ProcessOrderModal;
