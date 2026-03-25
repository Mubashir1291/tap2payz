import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { H2, H3, Subtitle1, ButtonTextSmall } from '../../utils/fonts';
import { ConnectedDeviceIcon } from '../../assets/Images';
import styles from './ConnectedDevicesScreenStyles';

const ConnectedDevicesScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      


      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={[styles.btnText, ButtonTextSmall]}>Forgot Device</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={[styles.btnText, ButtonTextSmall]}>+ Add New Device</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image 
            source={ConnectedDeviceIcon} 
            style={styles.deviceIcon} 
            resizeMode="contain" 
          />
          
          <View style={styles.infoContainer}>
            <Text style={[styles.infoLabel, H3]}>Device Info:</Text>
            <Text style={[styles.deviceName, H2]}>Samsung Galaxy S21 Ultra</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConnectedDevicesScreen;
