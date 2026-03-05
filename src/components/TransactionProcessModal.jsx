import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H4, Body2, Subtitle2} from '../utils/fonts';
import {CardpaymentIcon} from '../assets/Images';

const TransactionProcessModal = ({
  visible = false,
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

          {/* Card Payment Icon */}
          <Image source={CardpaymentIcon} style={styles.cardIcon} />

          {/* Title */}
          <Text style={[styles.title, H4]}>Transaction In Process!</Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, Body2]}>
            Please check your device to complete this transection.
          </Text>

          {/* Loading Spinner */}
          <ActivityIndicator
            size="large"
            color="#00BFFF"
            style={styles.loader}
          />
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
    alignItems: 'center',
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
  cardIcon: {
    width: S(60),
    height: VS(60),
    resizeMode: 'contain',
    marginBottom: VS(16),
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(10),
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.grey,
    marginBottom: VS(20),
  },
  loader: {
    marginTop: VS(8),
  },
});

export default TransactionProcessModal;
