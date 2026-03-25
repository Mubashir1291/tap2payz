import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H4, Body3, Subtitle1, Subtitle2, ButtonText} from '../utils/fonts';

const RefundAmountModal = ({
  visible = false,
  totalAmount = 0,
  onProceed,
  onClose,
}) => {
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
          <Text style={[styles.title, H4]}>
            Refund Amount <Text style={styles.titleLight}>(Cash)</Text>
          </Text>

          {/* Total Amount */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, Subtitle1]}>Total Amount:</Text>
            <Text style={[styles.totalValue, H4]}>
              $-{totalAmount.toFixed(2)}
            </Text>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity style={styles.proceedBtn} onPress={onProceed}>
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
  titleLight: {
    color: Colors.grey,
    fontFamily: 'Outfit-Regular',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(24),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalValue: {
    color: '#E74C3C',
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

export default RefundAmountModal;
