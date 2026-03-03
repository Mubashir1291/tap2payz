import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigator = () => {
  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <NavigationContainer>
      {/* {isLogin ? <AppStack /> : <AuthStack />} */}
      {<AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
