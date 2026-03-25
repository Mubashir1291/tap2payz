import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3 } from '../utils/fonts';

const sortOptions = [
  { id: 'a-z', label: 'A - Z' },
  { id: 'z-a', label: 'Z - A' },
  { id: 'name', label: 'By Name' },
];

const SortModal = ({ visible, onClose, onSelect, currentSort }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          {sortOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionRow, index < sortOptions.length - 1 && styles.borderBottom]}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
            >
              <Text style={[styles.optionText, H3]}>{option.label}</Text>

              <View
                style={[styles.radioOuter, currentSort === option.id && styles.radioOuterSelected]}
              >
                {currentSort === option.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: VS(150),
    paddingRight: S(200),
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: MS(12),
    width: S(240),
    paddingVertical: VS(8),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: VS(16),
    paddingHorizontal: S(24),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    color: '#333333',
  },
  radioOuter: {
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    borderWidth: 2,
    borderColor: '#C5CBE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3B4B8A',
  },
  radioInner: {
    width: S(12),
    height: S(12),
    borderRadius: S(6),
    backgroundColor: '#3B4B8A',
  },
});

export default SortModal;
