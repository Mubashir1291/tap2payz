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
import {H4, Body2, Body3, Subtitle2, ButtonText} from '../utils/fonts';

const QuickSaleModal = ({
  visible = false,
  onAddSale,
  onClose,
}) => {
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (visible) {
      setProductName('');
      setAmount('');
    }
  }, [visible]);

  const handleAddSale = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && onAddSale) {
      onAddSale({
        name: productName.trim() || 'Quick Sale Item',
        price: parsedAmount,
      });
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
          <Text style={[styles.title, H4]}>Quick Sale</Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, Body3]}>
            Kindly input the amount to facilitate{'\n'}a swift sale!
          </Text>

          {/* Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>
                Product Name <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="Product Name"
                placeholderTextColor={Colors.grey}
                value={productName}
                onChangeText={setProductName}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, Subtitle2]}>Amount</Text>
              <TextInput
                style={[styles.input, Body2]}
                placeholder="$0.00"
                placeholderTextColor={Colors.grey}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          {/* Add Sale Button */}
          <TouchableOpacity style={styles.addSaleBtn} onPress={handleAddSale}>
            <Text style={[styles.addSaleBtnText, ButtonText]}>Add Sale →</Text>
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
    marginBottom: VS(8),
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.grey,
    marginBottom: VS(20),
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(12),
    marginBottom: VS(20),
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  optionalText: {
    color: Colors.grey,
    fontSize: MS(11),
  },
  input: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(14),
    color: Colors.black,
  },
  addSaleBtn: {
    alignSelf: 'center',
    width: '50%',
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSaleBtnText: {
    color: Colors.black,
  },
});

export default QuickSaleModal;
