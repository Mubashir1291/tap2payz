import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H3, H4, Body2, Subtitle1, ButtonText } from '../../utils/fonts';
import { store } from '../../redux/store';
import { setCashRegisterData } from '../../redux/Reducers/deviceReducer';
import { logout } from '../../redux/Reducers/userReducer';
import { CLOSE_REGISTER, GET_CASH_REGISTER } from '../../services/StoreService';
import Toast from 'react-native-toast-message';

const CloseRegisterScreen = () => {
  const navigation = useNavigation();
  const { deviceId } = useSelector(state => state.device);
  const { userData, store_id } = useSelector(state => state.user);

  const [cashOutAmount, setCashOutAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(null);

  const handleGetCashRegister = useCallback(async () => {
    try {
      const query = {
        device_id: deviceId,
        employee_id: userData?._id,
        store_id,
      };
      const response = await GET_CASH_REGISTER(query);

      setState(response?.cashRegister);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching cash register',
        text2: error?.message || String(error),
      });
    }
  }, [deviceId, userData, store_id]);

  useFocusEffect(
    useCallback(() => {
      handleGetCashRegister();
    }, [handleGetCashRegister]),
  );

  const handleNumPress = num => {
    setCashOutAmount(prev => prev + num);
  };

  const handleBackspace = () => {
    setCashOutAmount(prev => prev.slice(0, -1));
  };

  const formattedAmount = () => {
    if (!cashOutAmount) {
      return '0';
    }
    return Number(cashOutAmount).toLocaleString();
  };

  const handleCloseRegister = async () => {
    setIsLoading(true);
    try {
      const payload = {
        cash_out: parseFloat(cashOutAmount) || 0,
        device_id: deviceId,
        employee_id: userData?._id,
        store_id,
      };

      await CLOSE_REGISTER(payload);
      store.dispatch(setCashRegisterData(null));
      store.dispatch(logout());

      Toast.show({
        type: 'success',
        text1: 'Register closed successfully',
      });

      navigation.navigate('SaleScreen');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error closing register',
        text2: error?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openingAmount = state?.opening_amount?.amount || 0;
  const salesAmount = state?.totalSales || 0;
  const expectedDrawerTotal = state?.net_cash || openingAmount + salesAmount;
  const currentCashOut = parseFloat(cashOutAmount) || 0;
  const closingBalance = expectedDrawerTotal - currentCashOut;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ───── LEFT SUMMARY PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeLabel, Body2]}>Welcome!</Text>
          <Text style={[styles.userName, H4]}>{userData?.employee_name}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, Subtitle1]}>Opening Amount</Text>
          <Text style={[styles.summaryValue, Subtitle1]}>{openingAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, Subtitle1]}>Sales</Text>
          <Text style={[styles.summaryValue, Subtitle1]}>{salesAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, Subtitle1]}>Total</Text>
          <Text style={[styles.summaryValue, Subtitle1]}>{expectedDrawerTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, Subtitle1]}>Closing Balance (Left in Drawer)</Text>
          <Text style={[styles.summaryValue, Subtitle1, { color: Colors.primary }]}>
            {closingBalance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* ───── RIGHT CASH OUT PANEL ───── */}
      <View style={styles.rightPanel}>
        <View style={styles.cashOutCard}>
          {/* Cash Out Header */}
          <View style={styles.cashOutHeader}>
            <Text style={[styles.cashOutLabel, Subtitle1]}>Cash Out</Text>
            <Text style={[styles.cashOutAmount, H3]}>CAD {formattedAmount()}</Text>
          </View>

          {/* Number Pad */}
          <View style={styles.numpadGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.numpadBtn}
                onPress={() => handleNumPress(num)}
              >
                <Text style={[styles.numpadText, Subtitle1]}>{num}</Text>
              </TouchableOpacity>
            ))}
            {/* Backspace */}
            <TouchableOpacity style={styles.numpadBtn} onPress={handleBackspace}>
              <Text style={[styles.numpadText, Subtitle1]}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Close Register Button */}
        <TouchableOpacity
          style={[styles.closeRegisterBtn, isLoading && styles.closeRegisterBtnLoading]}
          onPress={handleCloseRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.black} />
          ) : (
            <Text style={[styles.closeRegisterText, ButtonText]}>Close Register →</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },

  // ─── Left Panel ───
  leftPanel: {
    flex: 0.4,
    backgroundColor: Colors.white,
    padding: MS(28),
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: VS(8),
  },
  welcomeLabel: {
    color: Colors.grey,
  },
  userName: {
    color: Colors.black,
    marginTop: VS(2),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    borderStyle: 'dashed',
    marginVertical: VS(14),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: Colors.black,
  },
  summaryValue: {
    color: Colors.black,
  },
  closingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: VS(10),
  },
  closingLabel: {
    color: Colors.black,
    flex: 1,
  },
  closingValue: {
    color: Colors.black,
  },

  // ─── Right Panel ───
  rightPanel: {
    flex: 0.6,
    backgroundColor: '#EBF0FF',
    padding: MS(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashOutCard: {
    width: '70%',
    backgroundColor: Colors.white,
    borderRadius: MS(16),
    padding: MS(20),
    marginBottom: VS(20),
  },
  cashOutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
    paddingBottom: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  cashOutLabel: {
    color: Colors.black,
  },
  cashOutAmount: {
    color: Colors.black,
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numpadBtn: {
    width: '33.33%',
    paddingVertical: VS(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
  },
  numpadText: {
    color: Colors.black,
  },
  closeRegisterBtn: {
    paddingVertical: VS(14),
    paddingHorizontal: S(40),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeRegisterBtnLoading: {
    opacity: 0.7,
  },
  closeRegisterText: {
    color: Colors.black,
  },
});

export default CloseRegisterScreen;
