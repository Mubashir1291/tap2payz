import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { logout, setIsLogin } from '../redux/Reducers/userReducer';
import { H1, H2, Body2, Subtitle1 } from '../utils/fonts';
import { IconSize16, IconSize28 } from '../utils/IconSizes';
import {
  DiscountIcon,
  ReturnIcon,
  CloseRegisterIcon,
  ConnectedIcon,
  SettingIcon,
  LogoutIcon,
} from '../assets/Images';
import { store } from '../redux/store';

const drawerItems = [
  { label: 'Sale', icon: DiscountIcon, route: 'HomeScreen' },
  { label: 'Return', icon: ReturnIcon, route: null },
  { label: 'Close Register', icon: CloseRegisterIcon, route: null },
  { label: 'Connected Devices', icon: ConnectedIcon, route: null },
  { label: 'Settings', icon: SettingIcon, route: null },
];

const CustomDrawerContent = ({ navigation, state }) => {
  const dispatch = useDispatch();
  const activeRoute = state?.routes?.[state.index]?.name;

  const handleLogout = () => {
    store.dispatch(logout(true))
  };

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
          <Text style={[styles.avatarText, H2]}>JD</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={[styles.welcomeText, H2]}>Welcome!</Text>
          <Text style={[styles.userName, Body2]}>John Duo</Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {drawerItems.map((item, index) => {
          const isActive = item.route === activeRoute;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.activeMenuItem]}
              activeOpacity={0.7}
              onPress={() => {
                if (item.route) {
                  navigation.navigate(item.route);
                }
                navigation.closeDrawer();
              }}
            >
              <Image
                source={item.icon}
                style={[
                  IconSize16,
                  isActive ? styles.menuIconActive : styles.menuIconDefault,
                ]}
              />
              <Text
                style={[
                  styles.menuLabel, Subtitle1,
                  isActive ? styles.menuLabelActive : styles.menuLabelDefault,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Image source={LogoutIcon} style={[IconSize16, styles.logoutIcon]} />
        <Text style={[styles.logoutText, Subtitle1]}>Logout</Text>
      </TouchableOpacity>
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
