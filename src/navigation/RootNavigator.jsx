import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { navigationRef } from './NavigationRef';

const RootNavigator = () => {
  const isLogin = useSelector(state => state.user.isLogin);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* {isLogin ? <AppStack /> : <AuthStack />} */}
      <AppStack />
    </NavigationContainer>
  );
};

export default RootNavigator;
