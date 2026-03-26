import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { Subtitle2, Body1 } from '../utils/fonts';
import { ViewIcon, HideIcon } from '../assets/Images';

const CustomInput = ({ label, containerStyle, secureTextEntry, isPassword, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, Subtitle2, { color: Colors.primary }]}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
        <TextInput
          style={[styles.input, Body1]}
          placeholderTextColor={Colors.grey}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecure} style={styles.iconContainer}>
            <Image
              source={isSecure ? HideIcon : ViewIcon}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: VS(52),
    backgroundColor: Colors.inputBg,
    borderRadius: MS(12),
    borderWidth: VS(1.5),
    borderColor: Colors.lightGrey,
  },
  inputFocused: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: S(16),
    color: Colors.black,
  },
  iconContainer: {
    paddingHorizontal: S(16),
    height: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: S(20),
    height: VS(20),
    tintColor: Colors.grey,
  },
});

export default CustomInput;
