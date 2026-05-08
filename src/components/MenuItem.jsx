import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { Subtitle1 } from '../utils/fonts';
import { IconSize16 } from '../utils/IconSizes';

const MenuItem = ({ item, isActive, isDisabled, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.activeMenuItem]}
      activeOpacity={isDisabled ? 1 : 0.7}
      disabled={isDisabled}
      onPress={onPress}
    >
      <Image
        source={item.icon}
        style={[IconSize16, isActive ? styles.menuIconActive : styles.menuIconDefault]}
      />
      <Text
        style={[
          styles.menuLabel,
          Subtitle1,
          isActive ? styles.menuLabelActive : styles.menuLabelDefault,
          styles.menuLabelText,
        ]}
      >
        {item.label}
      </Text>
      {item.icon2 && (
        <Image
          source={item.icon2}
          style={[IconSize16, isActive ? styles.menuIconActive : styles.menuIconDefault]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(16),
    paddingHorizontal: S(18),
    borderRadius: MS(16),
    marginBottom: VS(6),
  },
  activeMenuItem: {
    backgroundColor: Colors.black,
  },
  menuIconDefault: {
    tintColor: Colors.black,
  },
  menuIconActive: {
    tintColor: Colors.white,
  },
  menuLabel: {
    marginLeft: S(16),
  },
  menuLabelText: {
    flex: 1,
  },
  menuLabelDefault: {
    color: Colors.black,
  },
  menuLabelActive: {
    color: Colors.white,
  },
});

export default MenuItem;
