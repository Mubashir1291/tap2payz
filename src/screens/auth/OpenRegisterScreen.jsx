import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Text,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '../../redux/Reducers/userReducer';
import { Colors } from '../../utils/Colors';
import CustomText from '../../components/CustomText';
import { DeleteIcon, WarningIcon } from '../../assets/Images';
import { IconSize12, IconSize20, IconSize24 } from '../../utils/IconSizes';

const summaryRows = [
  { label: 'Opening Amount', value: '0.00' },
  { label: 'Sales', value: '0.00' },
  { label: 'Online Sales', value: '0.00' },
  { label: 'Return', value: '0.00' },
  { label: 'Opening amount with cash register', value: '0.00' },
];

const numpadKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0', '.', 'C'],
];

const OpenRegisterScreen = () => {
  const dispatch = useDispatch();
  const [showCashIn, setShowCashIn] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('0.00');

  const handleKeyPress = key => {
    if (key === 'C') {
      setAmount('0.00');
      return;
    }

    if (key === '.') return; // decimal auto handled

    // Remove decimal
    let raw = amount.replace('.', '');

    // Remove leading zeros properly
    raw = String(parseInt(raw || '0', 10));

    // Add new digit
    raw = raw + key;

    // Limit to max 9 digits (change if needed)
    if (raw.length > 9) return;

    // Ensure at least 3 digits for cents handling
    while (raw.length < 3) {
      raw = '0' + raw;
    }

    const intPart = raw.slice(0, -2);
    const decPart = raw.slice(-2);

    setAmount(`${parseInt(intPart, 10)}.${decPart}`);
  };

  const handleOpenRegister = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    dispatch(setIsLogin(true));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ── Left Panel ── */}
      <View style={styles.leftPanel}>
        <View style={styles.welcomeSection}>
          <CustomText size={16} color={Colors.grey}>
            Welcome!
          </CustomText>
          <CustomText
            size={22}
            bold
            color={Colors.black}
            style={{ marginTop: 2 }}
          >
            John Duo.
          </CustomText>
        </View>

        <View style={styles.divider} />

        {summaryRows.map((row, index) => (
          <View key={index}>
            <View style={styles.summaryRow}>
              <CustomText size={15} color={Colors.black}>
                {row.label}
              </CustomText>
              <CustomText size={15} color={Colors.black}>
                {row.value}
              </CustomText>
            </View>
            {index < summaryRows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* ── Right Panel ── */}
      <View style={styles.rightPanel}>
        {showCashIn && (
          <View style={styles.cashInCard}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowCashIn(false)}
              activeOpacity={0.7}
            >
              <CustomText size={18} color={Colors.grey}>
                ✕
              </CustomText>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.cashInHeader}>
              <CustomText size={16} color={Colors.grey}>
                Cash In
              </CustomText>
              <CustomText size={24} bold color={Colors.black}>
                CAD {amount}
              </CustomText>
            </View>

            {/* Numpad */}
            <View style={styles.numpad}>
              {numpadKeys.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.numpadRow}>
                  {row.map(key => (
                    <TouchableOpacity
                      key={key}
                      style={styles.numpadKey}
                      activeOpacity={0.6}
                      onPress={() => handleKeyPress(key)}
                    >
                      <CustomText
                        size={20}
                        semiBold
                        color={key === 'C' ? Colors.primary : Colors.black}
                      >
                        {key}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Open Register Button */}
            <TouchableOpacity
              style={styles.openRegisterBtn}
              activeOpacity={0.85}
              onPress={handleOpenRegister}
            >
              <CustomText size={16} bold color={Colors.white}>
                Open Register {'  →'}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={WarningIcon} style={IconSize24} />

            <Text style={styles.modalTitle}>Ready to start making sale</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <CustomText size={16} semiBold color={Colors.primary}>
                  Cancel
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
                activeOpacity={0.85}
              >
                <CustomText size={16} bold color={Colors.white}>
                  Confirm
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  leftPanel: {
    flex: 0.4,
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderRightWidth: 1,
    borderRightColor: Colors.lightGrey,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  rightPanel: {
    flex: 0.6,
    backgroundColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  cashInCard: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 40,
  },
  numpad: {
    marginBottom: 20,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numpadKey: {
    flex: 1,
    aspectRatio: 2.8,
    marginHorizontal: 5,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openRegisterBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '35%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    gap: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
});

export default OpenRegisterScreen;
