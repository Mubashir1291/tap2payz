import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, H2, H3, H4, Body1, Subtitle1, ButtonText, Caption } from '../../utils/fonts';
import CustomInput from '../../components/CustomInput';
import { PSPIcon } from '../../assets/Images';
import { IconSize60 } from '../../utils/IconSizes';
import { LOGIN_ACCOUNT, ME } from '../../services/AuthServices';
import { VERIFY_DEVICE } from '../../services/AppServices';
import { setIsLogin, setAccessToken, setUserData } from '../../redux/Reducers/userReducer';
import { setDeviceId, setIsDeviceRegistered } from '../../redux/Reducers/deviceReducer';
import { store } from '../../redux/store';

const validationSchema = Yup.object().shape({
  storeCode: Yup.string().required('Store code is required'),
  employeeId: Yup.string().required('Employee ID is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isDeviceRegistered, deviceId: savedDeviceId } = useSelector(
    (state) => state.device,
  );

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values) => {
    setIsLoading(true);
    const payload = {
      store_code: values.storeCode,
      employee_id: values.employeeId,
      password: values.password,
    };

    try {
      const response = await LOGIN_ACCOUNT(payload);
      console.log('Login response:', response);

      if (response) {
        // Extract and store token
        const token =
          response.accessToken ||
          response.token ||
          response.data?.token ||
          response.data?.accessToken ||
          (typeof response === 'string' ? response : null);
        if (token) {
          store.dispatch(setAccessToken(token));
        }

        // Hit ME API right after login
        try {
          const meResponse = await ME();
          console.log('ME response:', meResponse);
          if (meResponse) {
            store.dispatch(setUserData(meResponse.data || meResponse));
          }
        } catch (meError) {
          console.log('ME API error:', meError);
        }

        // Check if device is already registered
        if (isDeviceRegistered && savedDeviceId) {
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
      } else {
        Toast.show({
          type: 'error',
          text1: response || 'Login failed',
        });
      }
    } catch (error) {
      console.log('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'An error occurred during login',
      });
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
      // The backend expects the MongoDB Object ID for the store, not the store code "4002".
      // We extract the Object ID from the ME response saved in Redux.
      const userState = store.getState()?.user || {};
      const userData = userState?.userData?.data || userState?.userData || {};
      const employeeData = userData?.employee || {};
      const storeObjectId =
        employeeData?.store_id && employeeData.store_id.length > 0
          ? employeeData.store_id[0]._id
          : null;

      const payload = {
        device_id: trimmedId,
        store_id: storeObjectId,
      };

      const response = await VERIFY_DEVICE(payload);
      console.log('VERIFY_DEVICE response:', response);

      // Save verified device Object ID (use _id from response)
      const verifiedDeviceId = response?.device?._id || response?.data?._id || response?._id || response?.data?.device?._id || trimmedId;
      store.dispatch(setDeviceId(verifiedDeviceId));
      console.log('Verified device ID:', verifiedDeviceId);
      store.dispatch(setIsDeviceRegistered(true));

      setShowDeviceModal(false);
      setDeviceIdInput('');

      // Now proceed to AppStack
      store.dispatch(setIsLogin(true));

      Toast.show({
        type: 'success',
        text1: 'Device verified successfully',
      });
    } catch (error) {
      console.log('Device verification error:', error);
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
      storeCode: '4002',
      employeeId: '1002',
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
          <Text style={[styles.brandTitle, H1, { color: Colors.white }]}>
            Point of Sale
          </Text>
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
            <Text
              style={[styles.welcomeText, H1, { fontSize: MS(26), color: Colors.primary }]}
            >
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
              />
              {formik.touched.password && formik.errors.password && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
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
      <Modal
        visible={showDeviceModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, H4, { color: Colors.primary }]}>
              Register Device
            </Text>
            <Text style={[styles.modalSubtitle, Body1, { color: Colors.grey }]}>
              Enter the device ID to link this terminal
            </Text>

            <TextInput
              style={styles.deviceInput}
              placeholder="Enter device ID"
              placeholderTextColor={Colors.grey}
              value={deviceIdInput}
              onChangeText={setDeviceIdInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.deviceSubmitBtn}
              activeOpacity={0.85}
              onPress={handleDeviceSubmit}
            >
              <Text style={[ButtonText, { color: Colors.white }]}>
                Verify & Continue
              </Text>
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  modalTitle: {
    marginBottom: VS(8),
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: VS(24),
  },
  deviceInput: {
    width: '100%',
    height: VS(52),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    fontSize: MS(16),
    color: Colors.black,
    backgroundColor: Colors.inputBg,
    marginBottom: VS(20),
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
