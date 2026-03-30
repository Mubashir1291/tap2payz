import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Subtitle2, ButtonText } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import { VERIFY_STORE_PASSKEY } from '../services/StoreService';
import { useSelector } from 'react-redux';

const PassKeyModal = ({ visible = false, onClose, navigation }) => {
  const [digits, setDigits] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);
  const { store_id } = useSelector(state => state.user);

  useEffect(() => {
    if (visible) {
      setDigits(['', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  const handleDigitChange = (text, index) => {
    const newDigits = [...digits];
    newDigits[index] = text.replace(/[^0-9]/g, '').slice(-1);
    setDigits(newDigits);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleProceed = async () => {
    const passkey = digits.join('');
    if (passkey.length === 5) {
      await VERIFY_STORE_PASSKEY(store_id, { passkey });
      onClose();
      navigation.navigate('SettingsScreen');
      navigation.closeDrawer();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Passkey',
        text2: 'Please enter a 5-digit passkey.',
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
          <Text style={[styles.title, H4]}>Enter Merchant Passkey</Text>

          {/* Label */}
          <Text style={[styles.label, Subtitle2]}>Enter Passkey</Text>

          {/* Digit Inputs */}
          <View style={styles.digitRow}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[styles.digitBox, Subtitle2]}
                value={digit}
                onChangeText={text => handleDigitChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                secureTextEntry={false}
              />
            ))}
          </View>

          {/* Proceed Button */}
          <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
            <Text style={[styles.proceedBtnText, ButtonText]}>Proceed →</Text>
          </TouchableOpacity>
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
  label: {
    color: Colors.black,
    marginBottom: VS(12),
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(24),
    gap: MS(10),
  },
  digitBox: {
    flex: 1,
    height: VS(55),
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    color: Colors.black,
    fontSize: MS(20),
  },
  proceedBtn: {
    alignSelf: 'center',
    width: '50%',
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedBtnText: {
    color: Colors.black,
  },
});

export default PassKeyModal;
