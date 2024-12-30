import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import Settingscreen from '../screens/Settingscreen';
import Generationscreen from '../screens/Generationscreen';
import ResultStack from './Resultstack';
import AntDesign from 'react-native-vector-icons/AntDesign'; 

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator
    initialRouteName="HomeStack"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        // Assign icons based on the route name
        if (route.name === 'HomeStack') {
          iconName = focused ? 'home' : 'home'; // Focused/Unfocused icon
        } else if (route.name === 'Resultstack') {
          iconName = focused ? 'dribbble' : 'dribbble';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'setting' : 'setting';
        }

        // Return the icon with the appropriate color and size
        return <AntDesign name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue', // Active tab color
      tabBarInactiveTintColor: 'gray', // Inactive tab color
      tabBarStyle: {
        backgroundColor: 'black', // Tab bar background color
        position: 'absolute', // Ensure the tab bar stays at the bottom
        left: 0,
        right: 0,
        bottom: 10, // Moves the tab bar a little higher (you can adjust this value)
        borderRadius: 50, // Apply rounded corners
        height: 60, // Tab bar height (optional)
        marginHorizontal:5,
        
      },

    })}
  >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Resultstack" component={ResultStack} />
      <Tab.Screen name="Settings" component={Settingscreen} />
    </Tab.Navigator>
  );
};

export default HomeTab;
