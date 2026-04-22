import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, H4, Body1, ButtonText } from '../../utils/fonts';
import CustomInput from '../../components/CustomInput';
import { PSPIcon } from '../../assets/Images';
import { IconSize60 } from '../../utils/IconSizes';
import { LOGIN_ACCOUNT, ME } from '../../services/AuthService';
import { VERIFY_DEVICE, GET_CASH_REGISTER } from '../../services/StoreService';
import { setIsLogin, setAccessToken, setUserData } from '../../redux/Reducers/userReducer';
import {
  setDeviceId,
  setIsDeviceRegistered,
  setCashRegisterData,
} from '../../redux/Reducers/deviceReducer';
import { store } from '../../redux/store';

const validationSchema = Yup.object().shape({
  storeCode: Yup.string().required('Store code is required'),
  employeeId: Yup.string().required('Employee ID is required'),
  password: Yup.string().required('Password is required'),
});

const DEVICE_ID_LENGTH = 6;

const LoginScreen = () => {
  const { isDeviceRegistered, deviceId: savedDeviceId } = useSelector(state => state.device);
  const { store_id } = useSelector(state => state.user);

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleLogin = async values => {
    setIsLoading(true);
    const payload = {
      store_code: values.storeCode,
      employee_id: values.employeeId,
      password: values.password,
    };
    console.log(payload, 'payload');
    try {
      const response = await LOGIN_ACCOUNT(payload);
      console.log(response, 'login');

      store.dispatch(setAccessToken(response.token));

      // Hit ME API right after login
      const meResponse = await ME();
      console.log(meResponse, 'me');

      const employeeData = meResponse?.employee;

      const employeeStore =
        employeeData?.store_id?.length > 1
          ? employeeData?.store_id?.find(_ => _?.store_code === Number(payload.store_code))
          : employeeData?.store_id[0];
      const employeeBusiness =
        employeeData?.business_id?.length > 1
          ? employeeData?.business_id?.find(_ => _?._id === employeeData?.business_id)
          : employeeData?.business_id[0];

      store.dispatch(
        setUserData({
          ...meResponse.employee,
          store_id: employeeStore?._id,
          business_id: employeeBusiness?._id,
          business_type: employeeBusiness?.business_type,
        }),
      );

      // Check if device is already registered
      if (isDeviceRegistered && savedDeviceId) {
        // Fetch Cash Register status to determine if we need to show OpenRegisterScreen
        try {
          const regQuery = {
            device_id: savedDeviceId,
            employee_id: employeeData?._id || meResponse?.employee?._id,
            store_id: employeeStore?._id,
          };
          const regResponse = await GET_CASH_REGISTER(regQuery);

          // Dispatch data: if an active register isn't found, we dispatch the last closed one or null
          store.dispatch(
            setCashRegisterData(regResponse?.cashRegister ?? regResponse?.closedRegister),
          );
        } catch (regError) {
          // Suppress error log for "Not Found" as it is a valid state before opening a register
          store.dispatch(setCashRegisterData(null));
        }

        // Device already registered from a previous session — go straight in
        store.dispatch(setIsLogin(true));
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
        });
      } else {
        // Show device ID modal
        setShowDeviceModal(true);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Please enter your device ID to continue',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'An error occurred during login',
      });
      console.log(error, 'checking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceSubmit = async () => {
    const trimmedId = deviceIdInput.trim();
    if (!trimmedId) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a device ID',
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        device_id: trimmedId,
        store_id,
      };
      console.log(payload, 'device');
      const response = await VERIFY_DEVICE(payload);

      const newDeviceId = response?.device?._id;

      store.dispatch(setDeviceId(newDeviceId));
      store.dispatch(setIsDeviceRegistered(true));

      // Fetch Cash Register status for the newly verified device
      try {
        const state = store.getState();
        const regQuery = {
          device_id: newDeviceId,
          employee_id: state.user.userData?._id,
          store_id: state.user.store_id,
        };
        const regResponse = await GET_CASH_REGISTER(regQuery);
        store.dispatch(
          setCashRegisterData(regResponse?.cashRegister ?? regResponse?.closedRegister),
        );
      } catch (regError) {
        store.dispatch(setCashRegisterData(null));
      }

      setShowDeviceModal(false);
      setDeviceIdInput('');

      // Now proceed to AppStack
      store.dispatch(setIsLogin(true));

      Toast.show({
        type: 'success',
        text1: 'Device verified successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Device verification failed',
        text2: error?.message || 'Invalid device ID',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      storeCode: '4001',
      employeeId: '1001',
      password: '1@2.comM',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Left branding panel */}
      <View style={styles.brandPanel}>
        <View style={styles.brandContent}>
          <View style={styles.logoCircle}>
            <Image source={PSPIcon} style={IconSize60} />
          </View>
          <Text style={[styles.brandTitle, H1, { color: Colors.white }]}>Point of Sale</Text>
          <Text style={[styles.brandTitle, Body1, { color: Colors.white }]}>
            Manage your store with ease
          </Text>
        </View>
      </View>

      {/* Right form panel */}
      <KeyboardAvoidingView
        style={styles.formPanel}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.formScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={[styles.welcomeText, H1, { fontSize: MS(26), color: Colors.primary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, Body1, { color: Colors.grey }]}>
              Sign in to your POS terminal
            </Text>

            <View style={styles.inputsWrapper}>
              <CustomInput
                label="Store Code"
                placeholder="Enter your store code"
                value={formik.values.storeCode}
                onChangeText={formik.handleChange('storeCode')}
                onBlur={formik.handleBlur('storeCode')}
                autoCapitalize="none"
                keyboardType="numeric"
              />
              {formik.touched.storeCode && formik.errors.storeCode && (
                <Text style={styles.errorText}>{formik.errors.storeCode}</Text>
              )}

              <CustomInput
                label="Employee ID"
                placeholder="Enter your employee ID"
                value={formik.values.employeeId}
                onChangeText={formik.handleChange('employeeId')}
                onBlur={formik.handleBlur('employeeId')}
                autoCapitalize="none"
                keyboardType="numeric"
              />
              {formik.touched.employeeId && formik.errors.employeeId && (
                <Text style={styles.errorText}>{formik.errors.employeeId}</Text>
              )}

              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                secureTextEntry
                isPassword={true}
              />
              {formik.touched.password && formik.errors.password && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
              activeOpacity={0.85}
              onPress={formik.handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={[ButtonText, { color: Colors.white }]}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Device ID Modal ── */}
      <Modal visible={showDeviceModal} transparent animationType="fade" onRequestClose={() => { }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, H4, { color: Colors.primary }]}>Register Device</Text>
            <Text style={[styles.modalSubtitle, Body1, { color: Colors.grey }]}>
              Enter the device ID to link this terminal
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              style={styles.otpContainer}
              onPress={() => inputRef.current?.focus()}
            >
              {[...Array(DEVICE_ID_LENGTH)].map((_, index) => (
                <View
                  key={index}
                  style={[styles.otpBox, deviceIdInput.length === index && styles.otpBoxActive]}
                >
                  <Text style={styles.otpText}>{deviceIdInput[index] || ''}</Text>
                </View>
              ))}
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={deviceIdInput}
                onChangeText={text => {
                  if (text.length <= DEVICE_ID_LENGTH) {
                    setDeviceIdInput(text);
                  }
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={DEVICE_ID_LENGTH}
                keyboardType="numeric"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deviceSubmitBtn}
              activeOpacity={0.85}
              onPress={handleDeviceSubmit}
            >
              <Text style={[ButtonText, { color: Colors.white }]}>Verify & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  brandPanel: {
    flex: 0.4,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: S(40),
  },
  brandContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: S(100),
    height: VS(100),
    borderRadius: MS(50),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VS(24),
  },
  brandTitle: {
    marginBottom: VS(8),
  },
  formPanel: {
    flex: 0.6,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
  },
  formScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '12%',
    paddingVertical: VS(40),
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(40),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: VS(4) },
    shadowOpacity: 0.08,
    shadowRadius: MS(16),
  },
  welcomeText: {
    marginBottom: VS(4),
  },
  subtitle: {
    marginBottom: VS(32),
  },
  inputsWrapper: {
    marginBottom: VS(12),
  },
  loginButton: {
    height: VS(52),
    backgroundColor: Colors.secondary,
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(8),
  },
  loginButtonLoading: {
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
    fontSize: MS(12),
    marginTop: VS(-8),
    marginBottom: VS(8),
    marginLeft: S(4),
  },

  /* ── Device ID Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '45%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: VS(8) },
    shadowOpacity: 0.15,
    shadowRadius: MS(24),
  },
  modalTitle: {
    marginBottom: VS(8),
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: VS(24),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: VS(24),
    position: 'relative',
  },
  otpBox: {
    width: S(45),
    height: VS(52),
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
  },
  otpBoxActive: {
    borderColor: Colors.primary,
  },
  otpText: {
    fontSize: MS(20),
    color: Colors.black,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  deviceSubmitBtn: {
    width: '100%',
    height: VS(50),
    backgroundColor: Colors.secondary,
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
