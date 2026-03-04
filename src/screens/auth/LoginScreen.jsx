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
} from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, Body1, ButtonText } from '../../utils/fonts';
import CustomInput from '../../components/CustomInput';
import { PSPIcon } from '../../assets/Images';
import { IconSize60 } from '../../utils/IconSizes';

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
});

export default LoginScreen;
