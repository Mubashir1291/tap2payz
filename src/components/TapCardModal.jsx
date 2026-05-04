import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '../utils/Colors';
import { H2 } from '../utils/fonts';
import { TapCardIcon } from '../assets/Images';
import { MS, VS, S } from '../utils/Responsive';

const TapCardModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <LottieView source={TapCardIcon} autoPlay loop style={styles.lottieIcon} />
          <Text style={[H2, styles.tapCardText]}>Please Tap Your Card</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    width: '70%',
    height: '70%',
    padding: MS(30),
    borderRadius: MS(15),
    alignItems: 'center',
    justifyContent: 'center',
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
  lottieIcon: {
    width: S(150),
    height: VS(150),
  },
  tapCardText: {
    marginTop: VS(20),
    color: Colors.black,
  },
});

export default TapCardModal;
