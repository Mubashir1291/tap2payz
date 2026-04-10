import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body2, Subtitle2, ButtonText } from '../utils/fonts';
import { ADD_BUYER } from '../services/Buyers';
import Toast from 'react-native-toast-message';

const BuyerInfoModal = ({
  visible = false,
  isEditMode = false,
  initialBuyerInfo = null,
  onAddInfo,
  onSaveInfo,
  onDeleteInfo,
  onClose,
  setBuyerId,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialBuyerInfo) {
        setFirstName(initialBuyerInfo.firstName || '');
        setLastName(initialBuyerInfo.lastName || '');
        setEmail(initialBuyerInfo.email || '');
        setPhone(initialBuyerInfo.phone || '');
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
      }
    }
  }, [visible, initialBuyerInfo]);

  const getBuyerInfo = () => {
    if (firstName.trim() || lastName.trim() || email.trim() || phone.trim()) {
      return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };
    }
    return null;
  };

  const handleAddInfo = () => {
    const info = getBuyerInfo();
    if (info && onAddInfo) {
      onAddInfo(info);
    }
  };

  const handleSaveInfo = () => {
    const info = getBuyerInfo();
    if (info && onSaveInfo) {
      onSaveInfo(info);
    }
  };

  const handleDeleteInfo = () => {
    if (onDeleteInfo) {
      onDeleteInfo();
    }
  };

  const handleBuyerInfo = async () => {
    try {
      const response = await ADD_BUYER({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });
      setBuyerId(response?.buyer?._id || null);
      console.log(response?.buyer?._id, 'buyerrr iddd');
      console.log(response, 'buyer info');

      if (response.success) {
        const buyerData = getBuyerInfo();
        onAddInfo(buyerData);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Buyer information added successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: response.message || 'Failed to add buyer',
        });
      }
    } catch (error) {
      console.error('Error adding buyer:', error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong',
      });
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H4]}>
            {isEditMode ? 'Edit Buyer Information' : 'Buyer Information'}
          </Text>

          {/* First Name & Last Name Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>Buyer's First Name</Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="First Name"
                placeholderTextColor={Colors.grey}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>Buyer's Last Name</Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="Last Name"
                placeholderTextColor={Colors.grey}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Email & Phone Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>Buyer's Email</Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="email@example.com"
                placeholderTextColor={Colors.grey}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>Buyer's Phone</Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="+1234567890"
                placeholderTextColor={Colors.grey}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* Action Buttons */}
          {isEditMode ? (
            <View style={styles.editButtonRow}>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteInfo}>
                <Text style={[styles.deleteBtnText, ButtonText]}>Delete Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveInfo}>
                <Text style={[styles.saveBtnText, ButtonText]}>Save Changes →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addInfoBtn} onPress={handleBuyerInfo}>
              <Text style={[styles.addInfoBtnText, ButtonText]}>Add Info →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    width: '45%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(14),
    right: S(14),
    zIndex: 10,
    width: S(28),
    height: VS(28),
    borderRadius: MS(14),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.grey,
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(20),
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(12),
    marginBottom: VS(16),
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  input: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(14),
    color: Colors.black,
  },
  addInfoBtn: {
    alignSelf: 'center',
    width: '50%',
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(8),
  },
  addInfoBtnText: {
    color: Colors.black,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(12),
    marginTop: VS(8),
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.white,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.black,
  },
});

export default BuyerInfoModal;
