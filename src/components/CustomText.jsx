import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';

const CustomText = ({
  children,
  size = 16,
  color = Colors.black,
  bold = false,
  semiBold = false,
  style,
  ...rest
}) => {
  const fontWeight = bold ? '700' : semiBold ? '600' : '400';

  return (
    <Text
      style={[styles.base, { fontSize: size, color, fontWeight }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
});

export default CustomText;
