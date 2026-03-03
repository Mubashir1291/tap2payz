import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '../../redux/Reducers/userReducer';
import { Colors } from '../../utils/Colors';
import CustomText from '../../components/CustomText';
import { WarningIcon } from '../../assets/Images';
import { IconSize24 } from '../../utils/IconSizes';

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

// Canadian Currency Denominations
const CANADIAN_COINS = ['5¢', '10¢', '25¢', '$1', '$2'];
const CANADIAN_NOTES = ['$5', '$10', '$20', '$50', '$100'];

const OpenRegisterScreen = () => {
  const dispatch = useDispatch();
  const [showCashIn, setShowCashIn] = useState(true);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false); // NEW
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('0.00');

  // Logic for Numpad (Unchanged)
  const handleKeyPress = key => {
    if (key === 'C') {
      setAmount('0.00');
      return;
    }
    if (key === '.') return;
    let raw = amount.replace('.', '');
    raw = String(parseInt(raw || '0', 10));
    raw = raw + key;
    if (raw.length > 9) return;
    while (raw.length < 3) {
      raw = '0' + raw;
    }
    const intPart = raw.slice(0, -2);
    const decPart = raw.slice(-2);
    setAmount(`${parseInt(intPart, 10)}.${decPart}`);
  };

  // STEP 1: Open the Currency Detail Modal first
  const handleOpenRegister = () => {
    setIsCurrencyModalVisible(true);
  };

  // STEP 2: From Currency Modal to Final Warning Modal
  const handleConfirmCurrency = () => {
    setIsCurrencyModalVisible(false);
    setIsModalVisible(true);
  };

  // STEP 3: Final Login Dispatch
  const handleConfirm = () => {
    dispatch(setIsLogin(true));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCurrencyModalVisible(false);
  };

  const renderCurrencyInput = (label) => (
    <View key={label} style={styles.currencyInputRow}>
      <CustomText size={14} color={Colors.black}>{label}</CustomText>
      <TextInput 
        style={styles.currencyBox} 
        keyboardType="number-pad" 
        placeholder="0" 
        placeholderTextColor={Colors.grey}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ── Left Panel ── */}
      <View style={styles.leftPanel}>
        <View style={styles.welcomeSection}>
          <CustomText size={16} color={Colors.grey}>Welcome!</CustomText>
          <CustomText size={22} bold color={Colors.black} style={{ marginTop: 2 }}>John Duo.</CustomText>
        </View>
        <View style={styles.divider} />
        {summaryRows.map((row, index) => (
          <View key={index}>
            <View style={styles.summaryRow}>
              <CustomText size={15} color={Colors.black}>{row.label}</CustomText>
              <CustomText size={15} color={Colors.black}>{row.value}</CustomText>
            </View>
            {index < summaryRows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* ── Right Panel ── */}
      <View style={styles.rightPanel}>
        {showCashIn && (
          <View style={styles.cashInCard}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCashIn(false)}>
              <CustomText size={18} color={Colors.grey}>✕</CustomText>
            </TouchableOpacity>

            <View style={styles.cashInHeader}>
              <CustomText size={16} color={Colors.grey}>Cash In</CustomText>
              <CustomText size={24} bold color={Colors.black}>CAD {amount}</CustomText>
            </View>

            <View style={styles.numpad}>
              {numpadKeys.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.numpadRow}>
                  {row.map(key => (
                    <TouchableOpacity key={key} style={styles.numpadKey} onPress={() => handleKeyPress(key)}>
                      <CustomText size={20} semiBold color={key === 'C' ? Colors.primary : Colors.black}>{key}</CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.openRegisterBtn} onPress={handleOpenRegister}>
              <CustomText size={16} bold color={Colors.white}>Open Register {'  →'}</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── NEW: Set Currency Modal ── */}
      <Modal visible={isCurrencyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.currencyModalContainer}>
            <TouchableOpacity style={styles.closeBtnTop} onPress={() => setIsCurrencyModalVisible(false)}>
              <CustomText size={20} color={Colors.grey}>✕</CustomText>
            </TouchableOpacity>
            
            <CustomText size={22} bold style={styles.currencyTitle}>Set Currency</CustomText>

            <View style={styles.currencyGrid}>
              {/* Coins Column */}
              <View style={styles.currencyColumn}>
                <CustomText size={18} semiBold style={{ marginBottom: 12 }}>Coins:</CustomText>
                <View style={styles.currencyGrayCard}>
                   {CANADIAN_COINS.map(renderCurrencyInput)}
                </View>
              </View>

              {/* Notes Column */}
              <View style={styles.currencyColumn}>
                <CustomText size={18} semiBold style={{ marginBottom: 12 }}>Notes:</CustomText>
                <View style={styles.currencyGrayCard}>
                   {CANADIAN_NOTES.map(renderCurrencyInput)}
                </View>
              </View>
            </View>

            <View style={styles.currencyFooter}>
               <View>
                  <CustomText size={16} color={Colors.black}>Total:</CustomText>
                  <CustomText size={26} bold color={Colors.black}>CAD {amount}</CustomText>
               </View>
               <TouchableOpacity style={styles.confirmBlueBtn} onPress={handleConfirmCurrency}>
                  <CustomText size={18} bold color={Colors.primary}>Confirm  →</CustomText>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Final Confirmation Modal ── */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={WarningIcon} style={IconSize24} />
            <Text style={styles.modalTitle}>Ready to start making sale</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <CustomText size={16} semiBold color={Colors.primary}>Cancel</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                <CustomText size={16} bold color={Colors.white}>Confirm</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (Your existing styles remain exactly as they were)
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.white },
  leftPanel: { flex: 0.4, paddingVertical: 36, paddingHorizontal: 32, borderRightWidth: 1, borderRightColor: Colors.lightGrey },
  welcomeSection: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 4 },
  divider: { height: 1, backgroundColor: Colors.lightGrey },
  rightPanel: { flex: 0.6, backgroundColor: '#EBF0FF', justifyContent: 'center', alignItems: 'center', padding: 32 },
  cashInCard: { width: '80%', backgroundColor: Colors.white, borderRadius: 20, padding: 28, elevation: 4, position: 'relative' },
  closeBtn: { position: 'absolute', top: 16, right: 20, zIndex: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.lightGrey, justifyContent: 'center', alignItems: 'center' },
  cashInHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingRight: 40 },
  numpad: { marginBottom: 20 },
  numpadRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  numpadKey: { flex: 1, aspectRatio: 2.8, marginHorizontal: 5, backgroundColor: '#F5F7FA', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  openRegisterBtn: { height: 50, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContainer: { width: '35%', backgroundColor: Colors.white, borderRadius: 20, padding: 32, alignItems: 'center', gap: 20 },
  modalTitle: { textAlign: 'center', fontSize: 18, fontWeight: '600' },
  modalButtonContainer: { flexDirection: 'row', width: '100%' },
  modalButton: { flex: 1, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cancelButton: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.lightGrey, marginRight: 8 },
  confirmButton: { backgroundColor: Colors.primary, marginLeft: 8 },

  // ADDED STYLES FOR THE NEW CURRENCY MODAL
  currencyModalContainer: { width: '90%', maxWidth: 900, backgroundColor: Colors.white, borderRadius: 24, padding: 40, position: 'relative' },
  closeBtnTop: { position: 'absolute', top: 20, right: 25 },
  currencyTitle: { textAlign: 'center', marginBottom: 30 },
  currencyGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  currencyColumn: { flex: 0.48 },
  currencyGrayCard: { backgroundColor: '#F7F8FA', borderRadius: 16, padding: 20 },
  currencyInputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  currencyBox: { backgroundColor: Colors.white, width: 70, height: 35, borderRadius: 6, textAlign: 'center', borderWeight: 1, borderColor: '#EEE' },
  currencyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  confirmBlueBtn: { backgroundColor: '#C8D7FF', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }
});

export default OpenRegisterScreen;