import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Generationscreen from '../screens/Generationscreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();

const ResultStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="GenerateVideo" component={Generationscreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
};

export default ResultStack;

const styles = StyleSheet.create({});
