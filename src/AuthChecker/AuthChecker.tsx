import React, { useContext, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';
import { showMessage } from "react-native-flash-message";
import HomeTab from "../navigation/HomeTab";
import SignInScreen from "./SignInscreen";
import { Screen } from "react-native-screens";

const AuthChecker = () => {
  const { user, loading, initializing }: any = useContext(AuthContext);
  const navigation:any = useNavigation();

  // Listen to FOREGROUND messaging
  useEffect(() => {
    const foregroundMessageListener = messaging().onMessage(remoteMessage => {
      const { notification } = remoteMessage;
      const Title = notification?.title;
      const Description = notification?.body;

      if (notification) {
        console.log('A new message arrived! (FOREGROUND)', JSON.stringify(remoteMessage));

        showMessage({
          message: Title as string,
          description: Description as string,
          type: "default",
          backgroundColor: "purple",
          color: "#FFFFFF",
        });
      }
    });

    // Listen to background state message when app is opened from background
    const backgroundMessageListener = messaging().onNotificationOpenedApp(remoteMessage => {
      setTimeout(() => {
        const { notification } = remoteMessage;
        const Title = notification?.title;
        const Description = notification?.body;
        console.log('App opened from BACKGROUND by tapping notification:', JSON.stringify(remoteMessage));

        showMessage({
          message: Title as string,
          description: Description as string,
          type: "default",
          backgroundColor: "purple",
          color: "#FFFFFF",
        });
      }, 3000);
    });

    // Handle the case when the app is opened from a killed state by tapping on a notification
    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(remoteMessage, 'App opened from killed state by tapping notification');
          setTimeout(() => {
            if (remoteMessage?.data) {
              console.log('Notification Data:', remoteMessage.data);
              navigation.navigate('Resultstack', {
                screen: 'ResultScreen',
                params: { notificationData: remoteMessage.data },
              });
            } else {
              navigation.navigate('Home');
            }
          }, 5000); // Delay of 5 seconds
        }
      })
      .catch(error => console.error('Error fetching initial notification:', error));

    // Cleanup listeners on component unmount
    return () => {
      foregroundMessageListener();
      backgroundMessageListener();
    };
  }, []);

  // Show loading indicator while loading or initializing
  if (loading || initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
        <ActivityIndicator color={"red"} size={"large"} />
        <Text>Please wait...</Text>
      </View>
    );
  }

  // Conditional rendering based on authentication status
  return user ? <HomeTab /> : <SignInScreen />;
};

export default AuthChecker;
