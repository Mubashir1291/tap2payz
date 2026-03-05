import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/app/HomeScreen';
import CloseRegisterScreen from '../screens/app/CloseRegisterScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import OpenRegisterScreen from '../screens/auth/OpenRegisterScreen';


const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
          backgroundColor: 'transparent',
        },
        overlayColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="CloseRegisterScreen" component={CloseRegisterScreen} />
    </Drawer.Navigator>
  );
};

export default AppStack;
