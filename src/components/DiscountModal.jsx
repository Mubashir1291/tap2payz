import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Body1, ButtonText, Subtitle2, Caption } from '../utils/fonts';

const DiscountModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialDiscountCode = '',
  availableDiscount,
}) => {
  const [code, setCode] = useState(initialDiscountCode);

  useEffect(() => {
    setCode(initialDiscountCode);
  }, [initialDiscountCode, visible]);

  const handleSave = () => {
    onSave(code);
    onClose();
  };

  const isEdit = initialDiscountCode.length > 0;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H3]}>{isEdit ? 'Edit Discount' : 'Add Discount'}</Text>

          {/* {availableDiscount && (
            <View style={styles.promoContainer}>
              <Text style={[Caption, styles.promoText]}>
                Available: <Text style={{ fontWeight: 'bold' }}>{availableDiscount.code}</Text> (
                {availableDiscount.percentage}%)
              </Text>
            </View>
          )} */}

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, Body1]}>Add Discount Code</Text>
            <TextInput
              style={[styles.textInput, Body1]}
              placeholder="Enter Code"
              placeholderTextColor={Colors.grey}
              value={code}
              onChangeText={setCode}
            />
          </View>

          <View style={styles.btnRow}>
            {isEdit && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  onDelete();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.deleteText, ButtonText]}>Delete Discount</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveBtn, isEdit && { ...styles.saveBtnEditStyle }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveBtnText, ButtonText]}>
                {isEdit ? 'Save Changes' : 'Add Discount'}
              </Text>
            </TouchableOpacity>
          </View>
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
    width: S(550),
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(32),
    height: S(32),
    borderRadius: S(16),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.grey,
  },
  title: {
    color: Colors.black,
    marginBottom: VS(12),
    textAlign: 'center',
  },
  promoContainer: {
    backgroundColor: '#E8F5E9',
    paddingVertical: VS(6),
    paddingHorizontal: S(12),
    borderRadius: MS(8),
    marginBottom: VS(16),
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  promoText: {
    color: '#2E7D32',
  },
  inputContainer: {
    width: '100%',
    marginBottom: VS(32),
  },
  inputLabel: {
    color: Colors.black,
    marginBottom: VS(12),
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    padding: MS(16),
    height: VS(56),
    color: Colors.black,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: S(12),
  },
  saveBtn: {
    backgroundColor: '#C6CDEF',
    width: '60%',
    height: VS(56),
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnEditStyle: {
    width: '48%',
  },
  saveBtnText: {
    color: '#3E468A',
  },
  deleteBtn: {
    backgroundColor: '#FFE5E1',
    width: '48%',
    height: VS(56),
    borderRadius: MS(12),
    borderWidth: 1,
    borderColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#E74C3C',
  },
});

export default DiscountModal;
