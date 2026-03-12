import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/app/HomeScreen';
import CloseRegisterScreen from '../screens/app/CloseRegisterScreen';
import ReturnScreen from '../screens/app/ReturnScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import OpenRegisterScreen from '../screens/auth/OpenRegisterScreen';
import TableSelectionScreen from '../screens/app/TableSelectionScreen';
import ViewOrdersScreen from '../screens/app/ViewOrdersScreen';
import OrderProcessingScreen from '../screens/app/OrderProcessingScreen';

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
      {/* <Drawer.Screen name="HomeScreen" component={HomeScreen} /> */}
      {/* <Drawer.Screen name="CloseRegisterScreen" component={CloseRegisterScreen} /> */}
      {/* <Drawer.Screen name="ReturnScreen" component={ReturnScreen} /> */}
      <Drawer.Screen name="TableSelectionScreen" component={TableSelectionScreen} />
      <Drawer.Screen name="ViewOrdersScreen" component={ViewOrdersScreen} />
      <Drawer.Screen name="OrderProcessingScreen" component={OrderProcessingScreen} />


      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default AppStack;
