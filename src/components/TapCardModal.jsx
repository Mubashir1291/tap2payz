import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '../utils/Colors';
import { H2 } from '../utils/fonts';
import { TapCardIcon } from '../assets/Images';
import { MS, VS, S } from '../utils/Responsive';

const TapCardModal = ({ visible }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LottieView
            source={TapCardIcon}
            autoPlay
            loop
            style={{ width: S(150), height: VS(150) }}
          />
          <Text style={[H2, { marginTop: VS(20), color: Colors.black }]}>Please Tap Your Card</Text>
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
  },
});

export default TapCardModal;
