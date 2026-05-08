import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H2, H3, H4, Body1, Subtitle1, Subtitle2, ButtonText } from '../utils/fonts';
import { CashIcon, CardIcon } from '../assets/Images';

const PaymentMethodModal = ({
  visible = false,
  totalAmount = 0,
  currency = '$',
  onProceed,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash' or 'Card'
  const [enteredAmount, setEnteredAmount] = useState('');

  useEffect(() => {
    if (visible) {
      setEnteredAmount('');
      setPaymentMethod('Cash');
    }
  }, [visible, totalAmount]);

  const parsedAmount = parseFloat(enteredAmount) || 0;
  const change = parsedAmount > totalAmount ? (parsedAmount - totalAmount).toFixed(2) : '0.00';

  const handleProceed = () => {
    if (onProceed) {
      onProceed({
        method: paymentMethod,
        amount: paymentMethod === 'Card' ? totalAmount : parsedAmount,
        change: paymentMethod === 'Card' ? '0.00' : change,
      });
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H3]}>Select Payment Method</Text>

          {/* Header Row: Total and Options */}
          <View style={styles.headerRow}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, H4]}>
                Total: {currency} {totalAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionBtn, paymentMethod === 'Cash' && styles.optionBtnActive]}
                onPress={() => setPaymentMethod('Cash')}
              >
                <View style={styles.optionContent}>
                  <Image source={CashIcon} style={styles.optionIcon} />
                  <Text style={[styles.optionText, Subtitle2]}>Cash</Text>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'Cash' && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionBtn, paymentMethod === 'Card' && styles.optionBtnActive]}
                onPress={() => setPaymentMethod('Card')}
              >
                <View style={styles.optionContent}>
                  <Image source={CardIcon} style={styles.optionIcon} />
                  <Text style={[styles.optionText, Subtitle2]}>Card</Text>
                  <View style={styles.radioOuter}>
                    {paymentMethod === 'Card' && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {paymentMethod === 'Cash' && (
            <>
              {/* Enter Amount Section */}
              <View style={styles.amountSection}>
                <Text style={[styles.sectionLabel, Subtitle1]}>Enter Amount</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.amountInput, Body1]}
                    value={enteredAmount}
                    onChangeText={setEnteredAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={Colors.grey}
                  />
                </View>
              </View>

              {/* Change Section */}
              <View style={styles.changeSection}>
                <Text style={[styles.sectionLabel, Subtitle1]}>Change:</Text>
                <Text style={[styles.changeValue, H2]}>
                  {currency}
                  {change}
                </Text>
              </View>
            </>
          )}

          {/* Proceed Button */}
          <TouchableOpacity
            style={[
              styles.proceedBtn,
              paymentMethod === 'Cash' && parsedAmount < totalAmount && styles.proceedBtnDisabled,
            ]}
            onPress={handleProceed}
            disabled={paymentMethod === 'Cash' && parsedAmount < totalAmount}
          >
            <Text style={[styles.proceedBtnText, ButtonText]}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: MS(24),
    padding: MS(32),
    width: S(700),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(20),
    right: S(20),
    width: S(32),
    height: S(32),
    borderRadius: S(16),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: Colors.grey,
    fontSize: MS(16),
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(32),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    color: Colors.black,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: S(16),
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(10),
    minWidth: S(120),
  },
  optionBtnActive: {
    borderColor: '#F0F0F0',
    backgroundColor: Colors.white,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S(8),
  },
  optionIcon: {
    width: S(20),
    height: S(20),
    resizeMode: 'contain',
  },
  optionText: {
    color: Colors.black,
    flex: 1,
  },
  radioOuter: {
    width: S(18),
    height: S(18),
    borderRadius: S(9),
    borderWidth: 1,
    borderColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: S(10),
    height: S(10),
    borderRadius: S(5),
    backgroundColor: '#3E468A',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginBottom: VS(24),
  },
  amountSection: {
    marginBottom: VS(24),
  },
  sectionLabel: {
    color: Colors.black,
    marginBottom: VS(12),
  },
  inputContainer: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    paddingHorizontal: S(20),
    height: VS(56),
    justifyContent: 'center',
  },
  amountInput: {
    color: Colors.black,
    fontSize: MS(18),
  },
  changeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(32),
  },
  changeValue: {
    color: Colors.black,
  },
  proceedBtn: {
    backgroundColor: '#C6CDEF',
    height: VS(56),
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  proceedBtnDisabled: {
    opacity: 0.7,
  },
  proceedBtnText: {
    color: '#3E468A',
  },
});

export default PaymentMethodModal;
