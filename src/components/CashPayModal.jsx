import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H4, Body2, Subtitle1, Subtitle2, ButtonText} from '../utils/fonts';

const CashPayModal = ({
  visible = false,
  totalAmount = 0,
  onProceed,
  onClose,
}) => {
  const [enteredAmount, setEnteredAmount] = useState('');

  useEffect(() => {
    if (visible) {
      setEnteredAmount('');
    }
  }, [visible]);

  const parsedAmount = parseFloat(enteredAmount) || 0;
  const change = parsedAmount > totalAmount ? (parsedAmount - totalAmount).toFixed(2) : '0.00';

  const handleProceed = () => {
    if (parsedAmount >= totalAmount && onProceed) {
      onProceed(parsedAmount);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H4]}>Cash Pay</Text>

          {/* Total Amount */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, Subtitle1]}>Total Amount:</Text>
            <Text style={[styles.totalValue, H4]}>€{totalAmount.toFixed(2)}</Text>
          </View>

          {/* Enter Amount */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, Subtitle2]}>Enter Amount</Text>
            <TextInput
              style={[styles.amountInput, Body2]}
              placeholder={`€${totalAmount.toFixed(2)}`}
              placeholderTextColor={Colors.grey}
              keyboardType="numeric"
              value={enteredAmount}
              onChangeText={setEnteredAmount}
            />
          </View>

          {/* Change */}
          <View style={styles.changeRow}>
            <Text style={[styles.changeLabel, Subtitle1]}>Change:</Text>
            <Text style={[styles.changeValue, H4]}>€{change}</Text>
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
    marginBottom: VS(24),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalValue: {
    color: Colors.black,
  },
  inputSection: {
    marginBottom: VS(16),
  },
  inputLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  amountInput: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(14),
    color: Colors.black,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(20),
  },
  changeLabel: {
    color: Colors.black,
  },
  changeValue: {
    color: Colors.black,
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

export default CashPayModal;
