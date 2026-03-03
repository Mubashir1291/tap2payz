import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Colors } from '../utils/Colors';
import CustomText from './CustomText';

const CustomInput = ({
  label,
  containerStyle,
  secureTextEntry,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <CustomText
          size={14}
          semiBold
          color={Colors.primary}
          style={styles.label}
        >
          {label}
        </CustomText>
      )}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholderTextColor={Colors.grey}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
  },
  inputFocused: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
  },
});

export default CustomInput;
