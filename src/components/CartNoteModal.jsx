import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H3, Body1, ButtonText, Subtitle2 } from '../utils/fonts';

const CartNoteModal = ({ visible, onClose, onSave, initialNote = '' }) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, visible]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  const isEdit = initialNote.length > 0;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H3]}>{isEdit ? 'Edit Note' : 'Add Note'}</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, Body1]}>Note</Text>
            <TextInput
              style={[styles.textInput, Body1]}
              placeholder="Write..."
              placeholderTextColor={Colors.grey}
              multiline
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={[styles.saveBtnText, ButtonText]}>
              {isEdit ? 'Save Changes' : 'Add Note'}
            </Text>
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
    marginBottom: VS(24),
    textAlign: 'center',
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
    height: VS(180),
    color: Colors.black,
  },
  saveBtn: {
    backgroundColor: '#C6CDEF',
    width: '50%',
    height: VS(56),
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#3E468A',
  },
});

export default CartNoteModal;
