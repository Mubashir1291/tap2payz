import React, {useState} from 'react';
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
import {H2, Body2, Subtitle2, Caption} from '../utils/fonts';
import {CameraIcon} from '../assets/Images';
import {IconSize16} from '../utils/IconSizes';

const CreateEmployeeModal = ({visible, onClose, onCreate}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreate = () => {
    // Basic validation
    if (name && email && password && password === confirmPassword) {
      onCreate({name, email, password});
      // reset fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
          <Text style={[styles.title, H2]}>Create Employee</Text>

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
              <Text style={[styles.label, Body2]}>Employee Name</Text>
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

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Create Password</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="PASSWORD"
                placeholderTextColor={Colors.grey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Confirm Password</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="PASSWORD"
                placeholderTextColor={Colors.grey}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, (!name || !email || !password || password !== confirmPassword) && styles.submitBtnDisabled]}
            onPress={handleCreate}
            disabled={!name || !email || !password || password !== confirmPassword}>
            <Text style={[styles.submitBtnText, Subtitle2]}>Add Merchant</Text>
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
    width: S(550),
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
    backgroundColor: Colors.inputcolor,
    borderRadius: MS(8),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    color: Colors.black,
  },
  submitBtn: {
    backgroundColor: Colors.buttonColor,
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

export default CreateEmployeeModal;
