import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

// Screens
import SaleScreen from '../screens/app/SaleScreen';
import CloseRegisterScreen from '../screens/app/CloseRegisterScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import OpenRegisterScreen from '../screens/auth/OpenRegisterScreen';
import TableSelectionScreen from '../screens/app/TableSelectionScreen';
import ViewOrdersScreen from '../screens/app/ViewOrdersScreen';
import OrderProcessingScreen from '../screens/app/OrderProcessingScreen';
import TableManagementScreen from '../screens/app/TableManagementScreen';
import AddNewTableScreen from '../screens/app/AddNewTableScreen';
import ConnectedDevicesScreen from '../screens/app/ConnectedDevicesScreen';
import TransactionReportScreen from '../screens/app/TransactionReportScreen';

import CustomDrawerContent from '../components/CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const renderDrawerContent = props => <CustomDrawerContent {...props} />;

//
// ✅ DRAWER (handles restaurant vs normal user)
//
const DrawerScreens = () => {
  const { userData } = useSelector(state => state.user);
  const isRestaurant = userData?.business_type === 'restaurant';

  return (
    <Drawer.Navigator
      key={isRestaurant ? 'restaurant' : 'normal'}
      initialRouteName={isRestaurant ? 'TableSelectionScreen' : 'SaleScreen'}
      drawerContent={renderDrawerContent}
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
      <Drawer.Screen name="SaleScreen" component={SaleScreen} />
      <Drawer.Screen name="TableSelectionScreen" component={TableSelectionScreen} />
      <Drawer.Screen name="TableManagementScreen" component={TableManagementScreen} />
      <Drawer.Screen name="TransactionReportScreen" component={TransactionReportScreen} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="ConnectedDevicesScreen" component={ConnectedDevicesScreen} />
      <Drawer.Screen name="CloseRegisterScreen" component={CloseRegisterScreen} />
    </Drawer.Navigator>
  );
};

//
// ✅ MAIN STACK (controls flow + goBack)
//
const AppStack = () => {
  const { cashRegister } = useSelector(state => state.device);

  const isRegisterOpen = !!(cashRegister && !cashRegister?.is_close);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isRegisterOpen ? (
        <Stack.Screen name="OpenRegister" component={OpenRegisterScreen} />
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerScreens} />

          <Stack.Screen name="OrderProcessingScreen" component={OrderProcessingScreen} />
          <Stack.Screen name="ViewOrdersScreen" component={ViewOrdersScreen} />
          <Stack.Screen name="AddNewTableScreen" component={AddNewTableScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
