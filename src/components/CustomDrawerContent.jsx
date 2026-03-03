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
import { setIsLogin } from '../redux/Reducers/userReducer';
import { IconSize16, IconSize28 } from '../utils/IconSizes';
import {
  DiscountIcon,
  ReturnIcon,
  CloseRegisterIcon,
  ConnectedIcon,
  SettingIcon,
  LogoutIcon,
} from '../assets/Images';

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
    dispatch(setIsLogin(false));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Menu</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* User Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.userName}>John Duo</Text>
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
                  styles.menuLabel,
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
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
  },
  closeBtn: {
    fontSize: 22,
    color: Colors.black,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  profileText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  userName: {
    fontSize: 14,
    color: Colors.grey,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 6,
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
    marginLeft: 16,
    fontSize: 15,
    fontWeight: '600',
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    marginTop: 10,
  },
  logoutIcon: {
    tintColor: Colors.black,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
});
