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
import TransactionReportScreen from '../screens/app/TransactionReportScreen';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();

const renderDrawerContent = props => <CustomDrawerContent {...props} />;

const AppStack = () => {
  const { cashRegister } = useSelector(state => state.device);
  const { userData } = useSelector(state => state.user);

  const isRegisterOpen = !!(cashRegister && !cashRegister?.is_close);
  const isRestaurant = userData?.business_type === 'restaurant';

  const getInitialRoute = () => {
    if (!cashRegister || cashRegister?.is_close) {
      return 'OpenRegister';
    }
    // If register is open, decide landing page based on business type
    return isRestaurant ? 'TableSelectionScreen' : 'SaleScreen';
  };

  return (
    <Drawer.Navigator
      key={isRegisterOpen ? 'register-open' : 'register-closed'}
      initialRouteName={getInitialRoute()}
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
      <Drawer.Screen name="OpenRegister" component={OpenRegisterScreen} />
      <Drawer.Screen name="TransactionReportScreen" component={TransactionReportScreen} />

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
