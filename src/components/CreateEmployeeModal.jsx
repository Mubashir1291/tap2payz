import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H2, Body2, Subtitle2 } from '../utils/fonts';
import { CameraIcon, ViewIcon, HideIcon } from '../assets/Images';
import { IconSize16 } from '../utils/IconSizes';
import { CREATE_EMPLOYEE } from '../services/Employee';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const CreateEmployeeModal = ({ visible, onClose, onCreate }) => {
  const { store_id } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await CREATE_EMPLOYEE({
          name: values.name,
          email: values.email,
          create_password: values.password,
          store_id,
          employee_profile: image,
        });
        Toast.show({ type: 'success', text1: 'Employee created successfully' });
        resetForm();
        setImage(null);
        onCreate();
      } catch (error) {
        Toast.show({ type: 'error', text1: error?.message || 'Error creating employee' });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && !response.errorMessage && response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleClose = () => {
    formik.resetForm();
    setImage(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H2]}>Create Employee</Text>

          {/* Avatar Area */}
          <View style={styles.avatarContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarPlaceholder} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <TouchableOpacity style={styles.cameraBtn} onPress={handleImageUpload}>
              <Image source={CameraIcon} style={[IconSize16, { ...styles.cameraBtnImage }]} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Employee Name</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="Name"
                placeholderTextColor={Colors.grey}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <Text style={styles.errorText}>{formik.errors.name}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Email Address</Text>
              <TextInput
                style={[styles.input, Subtitle2]}
                placeholder="Email Address"
                placeholderTextColor={Colors.grey}
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formik.touched.email && formik.errors.email && (
                <Text style={styles.errorText}>{formik.errors.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Create Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, Subtitle2]}
                  placeholder="PASSWORD"
                  placeholderTextColor={Colors.grey}
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image source={showPassword ? ViewIcon : HideIcon} style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>
              {formik.touched.password && formik.errors.password && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, Body2]}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, Subtitle2]}
                  placeholder="PASSWORD"
                  placeholderTextColor={Colors.grey}
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange('confirmPassword')}
                  onBlur={formik.handleBlur('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Image
                    source={showConfirmPassword ? ViewIcon : HideIcon}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={formik.handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#3B4B8A" />
            ) : (
              <Text style={[styles.submitBtnText, Subtitle2]}>Add Merchant</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(24),
    width: S(550),
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.grey,
    fontSize: MS(12),
  },
  title: {
    color: Colors.black,
    marginBottom: VS(24),
    marginTop: VS(16),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: VS(32),
  },
  avatarPlaceholder: {
    width: S(100),
    height: S(100),
    borderRadius: S(50),
    backgroundColor: '#D9E1E8',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: MS(6),
    borderRadius: MS(15),
    borderWidth: 1,
    borderColor: '#E6EAFA',
  },
  cameraBtnImage: {
    tintColor: '#3B4B8A',
  },
  formRow: {
    flexDirection: 'row',
    gap: MS(16),
    width: '100%',
    marginBottom: VS(16),
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  input: {
    backgroundColor: Colors.inputcolor,
    borderRadius: MS(8),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    color: Colors.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputcolor,
    borderRadius: MS(8),
    paddingHorizontal: S(16),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: VS(12),
    color: Colors.black,
  },
  eyeIcon: {
    width: S(20),
    height: S(20),
    tintColor: Colors.grey,
    resizeMode: 'contain',
  },
  submitBtn: {
    backgroundColor: Colors.buttonColor,
    paddingVertical: VS(14),
    paddingHorizontal: S(48),
    borderRadius: MS(8),
    marginTop: VS(16),
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#3B4B8A',
  },
  errorText: {
    color: 'red',
    fontSize: MS(10),
    marginTop: VS(4),
  },
});

export default CreateEmployeeModal;
