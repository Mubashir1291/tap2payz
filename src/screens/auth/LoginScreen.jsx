import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '../../utils/Colors';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';

const LoginScreen = ({ navigation }) => {
  const [storeId, setStoreId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('OpenRegister');
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Left branding panel */}
      <View style={styles.brandPanel}>
        <View style={styles.brandContent}>
          <View style={styles.logoCircle}>
            <CustomText size={36} bold color={Colors.white}>
              PSP
            </CustomText>
          </View>
          <CustomText
            size={28}
            bold
            color={Colors.white}
            style={styles.brandTitle}
          >
            Point of Sale
          </CustomText>
          <CustomText size={16} color="rgba(255,255,255,0.8)">
            Manage your store with ease
          </CustomText>
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
            <CustomText
              size={26}
              bold
              color={Colors.primary}
              style={styles.welcomeText}
            >
              Welcome Back
            </CustomText>
            <CustomText size={15} color={Colors.grey} style={styles.subtitle}>
              Sign in to your POS terminal
            </CustomText>

            <View style={styles.inputsWrapper}>
              <CustomInput
                label="Store ID"
                placeholder="Enter your store ID"
                value={storeId}
                onChangeText={setStoreId}
                autoCapitalize="none"
              />

              <CustomInput
                label="Merchant ID"
                placeholder="Enter your merchant ID"
                value={merchantId}
                onChangeText={setMerchantId}
                autoCapitalize="none"
              />

              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <CustomText size={17} bold color={Colors.white}>
                Login
              </CustomText>
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
    paddingHorizontal: 40,
  },
  brandContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    marginBottom: 8,
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
    paddingVertical: 40,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  welcomeText: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 32,
  },
  inputsWrapper: {
    marginBottom: 12,
  },
  loginButton: {
    height: 52,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;
