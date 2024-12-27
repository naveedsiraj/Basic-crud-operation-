import React, { useContext, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import HomeTab from "../navigation/HomeTab";

import messaging from '@react-native-firebase/messaging';
import { showMessage, hideMessage } from "react-native-flash-message";
import { navigationRef } from "../navigation/NavigationRef";
import HomeStack from "../navigation/HomeStack";
import SignInScreen from "./SignInscreen";

const AuthChecker = () => {
  const { user, loading, initializing }: any = useContext(AuthContext);


  // listen to FOREGROUND messeging
  useEffect(() => {

     messaging().onMessage( remoteMessage => {
      const { notification } = remoteMessage;
      
       const Title = notification?.title
       const Descciption = notification?.body
      if (notification) {
        console.log(
          'A new message arrived! (FOREGROUND)',
          JSON.stringify(remoteMessage),
        );
       } 
       
       showMessage({
        message: Title as string,
        description: Descciption as string,
        type: "default",
        backgroundColor: "purple",
        color: "#FFFFFF"
      });
     
     })
    
    // listen to kill state message 
    messaging().onNotificationOpenedApp(remoteMessage => {
      
setTimeout(() => {
  const { notification } = remoteMessage;
  const Title = notification?.title
  const Descciption = notification?.body
  console.log(
            'App opened from BACKGROUND by tapping notification:',
            JSON.stringify(remoteMessage),
          );
}, 3000)
      
  
     })
  
     messaging()
     .getInitialNotification()
       .then(remoteMessage => {
         console.log(remoteMessage, 'app open from kill state tapping notification')
       setTimeout(() => {
        //  if (navigationRef.isReady()) {
          //  console.log({navigationRef})
           if (remoteMessage?.data) {
             console.log('Notification Data:', remoteMessage.data);
            //  navigationRef.navigate('HomeTab', {
            //    screen: 'Settings', // Navigate to the Settings screen
            //    params: {
            //      notificationData: remoteMessage.data, // Pass notification data
            //    },
            //  });
          //  } else {
          //    navigationRef.navigate('HomeTab', {
          //      screen: 'HomeStack',
          //    });
           }
        //  }
       },5000);
     })
     .catch(error => console.error('Error fetching initial notification:', error));

 
  }, [])


  // listen to backgroundsseging



  
  if (loading || initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <ActivityIndicator color={"red"} size={"large"} />
        <Text>Please wait...</Text>
      </View>
    );
  }


  // Conditional rendering based on authentication status
  return user ? <HomeTab /> : <SignInScreen/>;
  // // If no user found, show SignInScreen
  // if (!user) {
  //    <SignInScreen />
  // }



  // If user is authenticated, show the HomeTab
  // return <HomeTab />;
};

export default AuthChecker;
