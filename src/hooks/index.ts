import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const usePushNotification = () => {

  const requestUserPermission = async () => {
    // Check if the platform is iOS
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled; // Return whether the permission is granted
  } 
  // Check if the platform is Android and version is 33 or above (Android 13+)
  else if (Platform.OS === 'android' && Platform.Version >= 33) {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );      
    
    // If permission is denied, ask the user to go to the settings
    if (res !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        'Notification Permission Required',
        'Please enable notifications in your settings to receive important updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Go to Settings', 
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false; // Permission is not granted
    }
    return true; // Permission is granted
  } 
  // For Android 11 (API level 30) and Android 12 (API level 31), permission is implicitly granted
  else if (Platform.OS === 'android' && Platform.Version >= 30 && Platform.Version < 33) {
    return true; // No need to request permission
  }
  else {
    // For Android versions below API 30, permission is implicitly granted
    return true;
  }
  };


  const getFCMToken = async () => { 
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
        return fcmToken;
      } else {
        console.log('Failed', 'No token received');
      }
    } catch (error: any) {
      console.log('Failed', 'No token received', error.message);
    }
  };


  const saveTokenToFirestore = async () => {
    try {
      // Get the FCM token
      const token = await messaging().getToken();
  
      // Check if there's a current user (assuming you're using Firebase Auth)
      const user = auth().currentUser;
  
      if (user) {
        const uid = user.uid;
  
        // Save the token to Firestore under the 'users' collection
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            fcmToken: token,
          });
  
        console.log('Token saved to Firestore for user:', uid);
      } else {
        console.log('No user is logged in');
      }
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
    }
  };

  
  // const listenToForegroundNotifications = async () => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     const { notification } = remoteMessage;
  //     if (notification) {
  //       const { title, body } = notification;
  //       console.log('Notification received in foreground:', notification);
  //       Alert.alert(title || 'Notification', body || 'You have a new message'); // Corrected template literals to variables
  //     }
  //     console.log(
  //       'A new message arrived! (FOREGROUND)',
  //       JSON.stringify(remoteMessage),
  //     );
  //   });
  //   return unsubscribe;
  // };

  // const listenToBackgroundNotifications = async () => {
  //   const unsubscribe = messaging().setBackgroundMessageHandler(
  //     async remoteMessage => {
  //       console.log(
  //         'A new message arrived! (BACKGROUND)',
  //         JSON.stringify(remoteMessage),
  //       );
  //     },
  //   );
  //   return unsubscribe;s
  // };

  // const onNotificationOpenedAppFromBackground = async () => {
  //   const unsubscribe = messaging().onNotificationOpenedApp(
  //     async remoteMessage => {
  //       console.log(
  //         'App opened from BACKGROUND by tapping notification:',
  //         JSON.stringify(remoteMessage),
  //       );
  //     },
  //   );
  //   return unsubscribe;
  // };

  // const onNotificationOpenedAppFromQuit = async () => {
  //   const message = await messaging().getInitialNotification();

  //   if (message) {
  //     console.log(
  //       'App opened from QUIT by tapping notification:',
  //       JSON.stringify(message),
  //     );
  //   }
  // };

  

  return {
    requestUserPermission,
    getFCMToken,
    // listenToForegroundNotifications,
    // listenToBackgroundNotifications,
    // onNotificationOpenedAppFromBackground,
    // onNotificationOpenedAppFromQuit,
  };
};
