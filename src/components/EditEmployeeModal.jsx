import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H2, Body2, Subtitle2} from '../utils/fonts';
import {CameraIcon} from '../assets/Images';
import {IconSize16} from '../utils/IconSizes';

const EditEmployeeModal = ({visible, onClose, onSave, employeeData}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (employeeData) {
      setName(employeeData.name || '');
      setEmail(employeeData.email || '');
    }
  }, [employeeData]);

  const handleSave = () => {
    if (name && email) {
      onSave({...employeeData, name, email});
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H2]}>Edit Employee</Text>

          {/* Avatar Area */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Image source={CameraIcon} style={[IconSize16, {tintColor: '#3B4B8A'}]} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Merchant Name</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="Name"
                placeholderTextColor={Colors.grey}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Email Address</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="Email Address"
                placeholderTextColor={Colors.grey}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, (!name || !email) && styles.submitBtnDisabled]}
            onPress={handleSave}
            disabled={!name || !email}>
            <Text style={[styles.submitBtnText, Subtitle2]}>Save Changes</Text>
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
    padding: MS(24),
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
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.grey,
    fontSize: MS(12),
  },
  title: {
    color: Colors.black,
    marginBottom: VS(24),
    marginTop: VS(16),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: VS(32),
  },
  avatarPlaceholder: {
    width: S(100),
    height: S(100),
    borderRadius: S(50),
    backgroundColor: '#D9E1E8',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: MS(6),
    borderRadius: MS(15),
    borderWidth: 1,
    borderColor: '#E6EAFA',
  },
  formRow: {
    flexDirection: 'row',
    gap: MS(16),
    width: '100%',
    marginBottom: VS(16),
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(8),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    color: Colors.black,
  },
  submitBtn: {
    backgroundColor: '#A8B7F8',
    paddingVertical: VS(14),
    paddingHorizontal: S(48),
    borderRadius: MS(8),
    marginTop: VS(16),
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#3B4B8A',
  },
});

export default EditEmployeeModal;
