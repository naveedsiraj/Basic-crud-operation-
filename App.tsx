import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import AuthChecker from './src/AuthChecker/AuthChecker'
import { usePushNotification } from './src/hooks'

import FlashMessage from "react-native-flash-message";
import { navigationRef } from './src/navigation/NavigationRef';

const App = () => {
  const { requestUserPermission,getFCMToken } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = async () => {
    
      try {

        const res = await requestUserPermission();
        if (res) {
          getFCMToken();
        }
      } catch (error: any) {
        console.log('Error at getting push notification: ', error.message);
      }
    };

    listenToNotifications();
  }, []);


  return (
   
      <NavigationContainer ref={navigationRef}>
      <AuthProvider>
      <AuthChecker/>
      </AuthProvider>
     <FlashMessage position="top" />
      </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})