import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Subtitle1, ButtonText, Body3 } from '../utils/fonts';

const EditTableModal = ({ visible, onClose, onSave, tableData }) => {
  const [seats, setSeats] = useState('');

  useEffect(() => {
    if (tableData) {
      // Extract numeric part from '5, Seats'
      const seatCount = tableData.seats.split(',')[0].trim();
      setSeats(seatCount);
    }
  }, [tableData, visible]);

  const handleSave = () => {
    onSave(seats);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H3]}>Edit Table: {tableData?.tableNo}</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, Subtitle1]}>Table Seats</Text>
            <TextInput
              style={[styles.input, Body3]}
              value={seats}
              onChangeText={setSeats}
              keyboardType="numeric"
              placeholder="00"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={[styles.saveBtnText, ButtonText]}>Save Changes</Text>
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
    width: S(500),
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
    marginBottom: VS(32),
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: VS(32),
  },
  label: {
    color: '#333',
    marginBottom: VS(12),
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#E0E0E0',
    borderRadius: MS(12),
    paddingHorizontal: S(20),
    height: VS(56),
    color: '#333',
    fontSize: MS(18),
  },
  saveBtn: {
    backgroundColor: '#A4B4FF', // Light blue as per screenshot
    paddingVertical: VS(16),
    paddingHorizontal: S(40),
    borderRadius: MS(12),
    width: '60%',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#3E468A', // Dark blue text
  },
});

export default EditTableModal;
