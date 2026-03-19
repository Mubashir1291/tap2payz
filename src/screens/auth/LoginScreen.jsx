import React from 'react';
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
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, Body1, ButtonText } from '../../utils/fonts';
import CustomInput from '../../components/CustomInput';
import { PSPIcon } from '../../assets/Images';
import { IconSize60 } from '../../utils/IconSizes';
import { LOGIN_ACCOUNT } from '../../services/AuthServices';
import { setIsLogin } from '../../redux/Reducers/userReducer';
import { store } from '../../redux/store';

const validationSchema = Yup.object().shape({
  storeCode: Yup.string().required('Store code is required'),
  employeeId: Yup.string().required('Employee ID is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    const payload = {
      store_code: values.storeCode,
      employee_id: values.employeeId,
      password: values.password,
    };

    try {
      const response = await LOGIN_ACCOUNT(payload);
      console.log('Login response:', response);
      
      if (response) {
        store.dispatch(setIsLogin(true));
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response || 'Login failed',
        });
      }
    } catch (error) {
      console.log('Login errorrrr:', error);
      Toast.show({
        type: 'error',
        text1: 'An error occurred during login',
      
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      storeCode: '',
      employeeId: '',
      password: '',
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
          <Text
            style={[styles.brandTitle, H1, { color: Colors.white }]}
          >
            Point of Sale
          </Text>
             <Text
            style={[styles.brandTitle, Body1, { color: Colors.white }]}
          >
          Manage your store with ease
          </Text>
          {/* <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
            Manage your store with ease
          </Text> */}
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
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={formik.handleSubmit}
            >
              <Text style={[ButtonText, { color: Colors.white }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
});

export default LoginScreen;
