import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import SignInScreen from '../screens/SignInscreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Homescreen" component={Home} />
      <Stack.Screen name="createAccount" component={SignInScreen} />
     </Stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})