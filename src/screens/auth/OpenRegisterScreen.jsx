import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, Modal, Text, Image, TextInput } from 'react-native';
import { Colors } from '../../utils/Colors';
import { WarningIcon } from '../../assets/Images';
import { IconSize24 } from '../../utils/IconSizes';
import {
  H2,
  H3,
  H4,
  Subtitle1,
  Subtitle2,
  Body1,
  Body3,
  Caption,
  ButtonText,
  ButtonTextSmall,
} from '../../utils/fonts';
import styles from './OpenRegisterScreenstyles';
import { OPEN_REGISTER } from '../../services/StoreService';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

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

const DENOMINATIONS = {
  '5¢': 0.05,
  '10¢': 0.1,
  '25¢': 0.25,
  $1: 1.0,
  $2: 2.0,
  $5: 5.0,
  $10: 10.0,
  $20: 20.0,
  $50: 50.0,
  $100: 100.0,
};

const OpenRegisterScreen = ({ navigation }) => {
  const { deviceId } = useSelector(state => state.device);
  const { userData, store_id } = useSelector(state => state.user);

  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('0.00');
  const [currencyCounts, setCurrencyCounts] = useState({});
  const [showError, setShowError] = useState(false);

  // Logic for Numpad
  const handleKeyPress = key => {
    if (key === 'C') {
      setAmount('0.00');
      setShowError(false);
      return;
    }
    setShowError(false);
    if (key === '.') {
      return;
    }
    let raw = amount.replace('.', '');
    raw = String(parseInt(raw || '0', 10));
    raw = raw + key;
    if (raw.length > 9) {
      return;
    }
    while (raw.length < 3) {
      raw = '0' + raw;
    }
    const intPart = raw.slice(0, -2);
    const decPart = raw.slice(-2);
    setAmount(`${parseInt(intPart, 10)}.${decPart}`);
  };

  // STEP 1: Open the Currency Detail Modal with the entered amount
  const handleOpenRegister = () => {
    if (parseFloat(amount) <= 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setCurrencyCounts({});
    setIsCurrencyModalVisible(true);
  };

  const calculatedTotal = Object.keys(currencyCounts)
    .reduce((sum, key) => {
      const count = parseInt(currencyCounts[key] || '0', 10);
      const value = DENOMINATIONS[key] || 0;
      return sum + count * value;
    }, 0)
    .toFixed(2);

  const enteredAmount = parseFloat(amount).toFixed(2);
  const remaining = (parseFloat(enteredAmount) - parseFloat(calculatedTotal)).toFixed(2);
  const isMatched = remaining === '0.00';
  const isOverAmount = parseFloat(calculatedTotal) > parseFloat(enteredAmount);

  // STEP 2: From Currency Modal to Final Warning Modal
  const handleConfirmCurrency = () => {
    if (!isMatched) {
      return;
    }
    setIsCurrencyModalVisible(false);
    setIsModalVisible(true);
  };

  // STEP 3: Final Login Dispatch
  const handleConfirm = async () => {
    try {
      const payload = {
        device_id: deviceId,
        employee_id: userData?._id,
        store_id,
        opening_amount: parseFloat(amount),
      };

      await OPEN_REGISTER(payload);

      // console.log({ res });

      setIsModalVisible(false);
      navigation.navigate('SaleScreen');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error opening register',
        text2: error?.message || String(error),
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCurrencyModalVisible(false);
  };

  const renderCurrencyInput = label => (
    <View key={label} style={styles.currencyInputRow}>
      <Text style={styles.currencyInputLabel}>{label}</Text>
      <TextInput
        style={styles.currencyBox}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={Colors.grey}
        value={currencyCounts[label] || ''}
        onChangeText={text => {
          const val = text.replace(/[^0-9]/g, '');
          setCurrencyCounts(prev => ({ ...prev, [label]: val }));
        }}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ── Left Panel ── */}
      <View style={styles.leftPanel}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, Subtitle1]}>Welcome!</Text>
          <Text style={[styles.userName, H2]}>John Duo.</Text>
        </View>
        <View style={styles.divider} />
        {summaryRows.map((row, index) => (
          <View key={index}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, Body1]}>{row.label}</Text>
              <Text style={[styles.summaryText, Body1]}>{row.value}</Text>
            </View>
            {index < summaryRows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* ── Right Panel ── */}
      <View style={styles.rightPanel}>
        <View style={styles.cashInCard}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.closeBtnText, H4]}>✕</Text>
          </TouchableOpacity>

          <View style={styles.cashInHeader}>
            <Text style={[styles.cashInLabel, Subtitle1]}>Cash In</Text>
            <Text style={[styles.cashInAmount, H2]}>CAD {amount}</Text>
          </View>

          <View style={styles.numpad}>
            {numpadKeys.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.numpadRow}>
                {row.map(key => (
                  <TouchableOpacity
                    key={key}
                    style={styles.numpadKey}
                    onPress={() => handleKeyPress(key)}
                  >
                    <Text style={[key === 'C' ? styles.numpadClearText : styles.numpadKeyText, H3]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.openRegisterBtn} onPress={handleOpenRegister}>
            <Text style={[styles.openRegisterBtnText, ButtonText]}>Open Register {'  →'}</Text>
          </TouchableOpacity>
          {showError && <Text style={[styles.errorText, Caption]}>Please enter the amount</Text>}
        </View>
      </View>

      {/* ── Set Currency Modal ── */}
      <Modal visible={isCurrencyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.currencyModalContainer}>
            <TouchableOpacity
              style={styles.closeBtnTop}
              onPress={() => setIsCurrencyModalVisible(false)}
            >
              <Text style={[styles.closeBtnTopText, Subtitle1]}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.currencyTitle, H4]}>Set Currency</Text>

            {/* Entered Amount Banner */}
            <View style={styles.enteredAmountBanner}>
              <Text style={[styles.enteredAmountLabel, Body3]}>Opening Amount</Text>
              <Text style={[styles.enteredAmountValue, Subtitle1]}>CAD {enteredAmount}</Text>
            </View>

            <View style={styles.currencyGrid}>
              {/* Coins Column */}
              <View style={styles.currencyColumn}>
                <Text style={[styles.currencyColumnTitle, Subtitle2]}>Coins:</Text>
                <View style={styles.currencyGrayCard}>
                  {CANADIAN_COINS.map(renderCurrencyInput)}
                </View>
              </View>

              {/* Notes Column */}
              <View style={styles.currencyColumn}>
                <Text style={[styles.currencyColumnTitle, Subtitle2]}>Notes:</Text>
                <View style={styles.currencyGrayCard}>
                  {CANADIAN_NOTES.map(renderCurrencyInput)}
                </View>
              </View>
            </View>

            <View style={styles.currencyFooter}>
              <View>
                <Text style={[styles.totalLabel, Body3]}>Counted:</Text>
                <Text style={[styles.totalAmount, H3, isOverAmount && styles.mismatchText]}>
                  CAD {calculatedTotal}
                </Text>
              </View>
              <View style={styles.remainingContainer}>
                <Text style={[styles.remainingLabel, Caption]}>
                  {isOverAmount ? 'Over by:' : 'Remaining:'}
                </Text>
                <Text
                  style={[
                    styles.remainingValue,
                    Subtitle1,
                    isMatched ? styles.matchedText : styles.mismatchText,
                  ]}
                >
                  CAD{' '}
                  {isOverAmount
                    ? (parseFloat(calculatedTotal) - parseFloat(enteredAmount)).toFixed(2)
                    : remaining}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.confirmBlueBtn,
                  (!isMatched || isOverAmount) && styles.confirmBlueBtnDisabled,
                ]}
                onPress={handleConfirmCurrency}
                disabled={!isMatched || isOverAmount}
              >
                <Text
                  style={[
                    styles.confirmBlueBtnText,
                    ButtonTextSmall,
                    (!isMatched || isOverAmount) && styles.confirmBlueBtnTextDisabled,
                  ]}
                >
                  Confirm →
                </Text>
              </TouchableOpacity>
            </View>
            {isOverAmount && (
              <Text style={[styles.overAmountWarning, Caption]}>
                ⚠ Counted amount exceeds the opening amount. Please adjust.
              </Text>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Final Confirmation Modal ── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={WarningIcon} style={IconSize24} />
            <Text style={[styles.modalTitle, H4]}>Ready to start making sale</Text>
            <Text style={[styles.modalSubtitle, Body3]}>Please confirm to open the register</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={[styles.cancelButtonText, ButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={[styles.confirmButtonText, ButtonText]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OpenRegisterScreen;
