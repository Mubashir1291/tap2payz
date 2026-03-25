import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { Subtitle2, Body1 } from '../utils/fonts';

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
        <Text
          style={[styles.label, Subtitle2, { color: Colors.primary }]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, Body1, isFocused && styles.inputFocused]}
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
    marginBottom: VS(20),
    width: '100%',
  },
  label: {
    marginBottom: VS(8),
  },
  input: {
    height: VS(52),
    backgroundColor: Colors.inputBg,
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    color: Colors.black,
    borderWidth: VS(1.5),
    borderColor: Colors.lightGrey,
  },
  inputFocused: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
  },
});

export default CustomInput;
