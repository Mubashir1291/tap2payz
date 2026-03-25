import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SaleScreen from '../screens/app/SaleScreen';
import CloseRegisterScreen from '../screens/app/CloseRegisterScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import OpenRegisterScreen from '../screens/auth/OpenRegisterScreen';
import TableSelectionScreen from '../screens/app/TableSelectionScreen';
import ViewOrdersScreen from '../screens/app/ViewOrdersScreen';
import OrderProcessingScreen from '../screens/app/OrderProcessingScreen';
import TableManagementScreen from '../screens/app/TableManagementScreen';
import AddNewTableScreen from '../screens/app/AddNewTableScreen';
import ConnectedDevicesScreen from '../screens/app/ConnectedDevicesScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
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
      <Stack.Screen name="OpenRegister" component={OpenRegisterScreen} />

      <Drawer.Screen name="SaleScreen" component={SaleScreen} />
      <Drawer.Screen name="CloseRegisterScreen" component={CloseRegisterScreen} />
      {/* <Drawer.Screen name="ReturnScreen" component={ReturnScreen} /> */}
      <Drawer.Screen name="TableSelectionScreen" component={TableSelectionScreen} />
      <Drawer.Screen name="ViewOrdersScreen" component={ViewOrdersScreen} />
      <Drawer.Screen name="OrderProcessingScreen" component={OrderProcessingScreen} />
      <Drawer.Screen name="TableManagementScreen" component={TableManagementScreen} />
      <Drawer.Screen name="AddNewTableScreen" component={AddNewTableScreen} />

      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="ConnectedDevicesScreen" component={ConnectedDevicesScreen} />
    </Drawer.Navigator>
  );
};

export default AppStack;
