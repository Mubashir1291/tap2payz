import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body3, Subtitle2, ButtonText } from '../utils/fonts';

const ConfirmationModal = ({
  visible = false,
  icon,
  iconStyle,
  title,
  subtitle,
  confirmText = 'Confirm',
  confirmButtonColor,
  confirmTextColor,
  onCancel,
  onConfirm,
  onRequestClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose || onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>
          {icon && <Image source={icon} style={iconStyle} />}
          {title && <Text style={[styles.title, H4]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, Body3]}>{subtitle}</Text>}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              confirmButtonColor && { backgroundColor: confirmButtonColor },
            ]}
            onPress={onConfirm}
          >
            <Text style={[styles.confirmButtonText, ButtonText, confirmTextColor && { color: confirmTextColor }]}>
              {confirmText}
            </Text>
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
    width: '35%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    alignItems: 'center',
    gap: MS(14),
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
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.grey,
  },
  confirmButton: {
    width: '50%',
    height: VS(50),
    borderRadius: MS(12),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(4),
  },
  confirmButtonText: {
    color: Colors.white,
  },
});

export default ConfirmationModal;
