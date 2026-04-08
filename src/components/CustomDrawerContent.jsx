import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { logout } from '../redux/Reducers/userReducer';
import { H1, H2, Body2, Subtitle1, H3 } from '../utils/fonts';
import { IconSize16 } from '../utils/IconSizes';
import {
  DiscountIcon,
  CloseRegisterIcon,
  ConnectedIcon,
  SettingIcon,
  LogoutIcon,
  LockIcon,
  TableIcon,
  ShopIcon,
} from '../assets/Images';
import { store } from '../redux/store';
import PassKeyModal from './PassKeyModal';
import { useSelector } from 'react-redux';
import { LOGOUT } from '../services/AuthService';

const drawerItems = [
  { label: 'Sale', icon: DiscountIcon, route: 'SaleScreen' },
  // { label: 'Return', icon: ReturnIcon, route: 'ReturnScreen' },
  { label: 'Restaurant Orders', icon: ShopIcon, route: 'TableSelectionScreen' },
  { label: 'Close Register', icon: CloseRegisterIcon, route: 'CloseRegisterScreen' },
  { label: 'Connected Devices', icon: ConnectedIcon, route: 'ConnectedDevicesScreen' },
  { label: 'Settings', icon: SettingIcon, icon2: LockIcon, route: null },
  { label: 'Table Management', icon: TableIcon, route: 'TableManagementScreen' },
];

const CustomDrawerContent = ({ navigation, state }) => {
  const activeRoute = state?.routes?.[state.index]?.name;
  const [showPasskey, setShowPasskey] = useState(false);
  const { userData } = useSelector(_ => _.user);

  const handleLogout = () => {
    const response = LOGOUT();
    console.log(response, 'logout');
    store.dispatch(logout(true));
  };

  function getInitials(name) {
    if (!name) {
      return '';
    }

    const parts = name.trim().split(' ');

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    const first = parts[0][0];
    const last = parts[parts.length - 1][0];

    return (first + last).toUpperCase();
  }

  // Filter items based on business type
  const filteredItems =
    userData?.business_type === 'restaurant'
      ? drawerItems.filter(item =>
          ['Restaurant Orders', 'Close Register', 'Table Management'].includes(item.label),
        )
      : drawerItems;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.menuTitle, H1]}>Menu</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Text style={[styles.closeBtn, H1]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* User Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={[styles.avatarText, H2]}>{getInitials(userData?.employee_name)}</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={[styles.welcomeText, H3]}>Welcome!</Text>
          <Text style={[styles.userName, Body2]}>{userData?.employee_name}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item, index) => {
          // Settings tab is active if current route is SettingsScreen
          const isSettingsTab = item.label === 'Settings';
          const isSettingsActive = activeRoute === 'SettingsScreen';
          const isActive = isSettingsTab ? isSettingsActive : item.route === activeRoute;
          const isDisabled = isSettingsTab && isSettingsActive;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isActive && styles.activeMenuItem,
                isDisabled && { opacity: 0.5 },
              ]}
              activeOpacity={isDisabled ? 1 : 0.7}
              disabled={isDisabled}
              onPress={() => {
                if (isSettingsTab) {
                  if (!isSettingsActive) setShowPasskey(true);
                } else if (item.route) {
                  navigation.navigate(item.route);
                  navigation.closeDrawer();
                } else {
                  navigation.closeDrawer();
                }
              }}
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
                  { ...styles.menuLabelText },
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
        })}
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Image source={LogoutIcon} style={[IconSize16, styles.logoutIcon]} />
        <Text style={[styles.logoutText, Subtitle1]}>Logout</Text>
      </TouchableOpacity>

      <PassKeyModal
        visible={showPasskey}
        onClose={() => setShowPasskey(false)}
        navigation={navigation}
      />
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: S(20),
    paddingTop: VS(20),
    paddingBottom: VS(30),
    borderTopRightRadius: MS(24),
    borderBottomRightRadius: MS(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(24),
  },
  menuTitle: {
    color: Colors.black,
  },
  closeBtn: {
    color: Colors.black,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(30),
  },
  avatar: {
    width: S(50),
    height: VS(50),
    borderRadius: MS(25),
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(14),
  },
  avatarText: {
    color: Colors.white,
  },
  profileText: {
    flex: 1,
  },
  welcomeText: {
    color: Colors.black,
  },
  userName: {
    color: Colors.grey,
  },
  menuList: {
    flex: 1,
  },
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(16),
    paddingHorizontal: S(18),
    borderTopWidth: VS(1),
    borderTopColor: Colors.lightGrey,
    marginTop: VS(10),
  },
  logoutIcon: {
    tintColor: Colors.black,
  },
  logoutText: {
    marginLeft: S(16),
    color: Colors.black,
  },
});
