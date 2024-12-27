import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import Settingscreen from '../screens/Settingscreen';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home">
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Settings" component={Settingscreen} />
    </Tab.Navigator>
  );
};

export default HomeTab;
