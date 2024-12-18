// import React, { useContext, useEffect, useState } from "react";
// import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
// import { AuthContext } from "../context/AuthContext";
// import HomeStack from "../navigation/HomeStack";
// import SignInScreen from "../screens/SignInscreen";

// // Verification Screen Component
// const VerificationScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 16, textAlign: "center", color: "black" }}>
//         Go and verify your email, then restart your app.
//       </Text>
//     </View>
//   );
// };

// const AuthChecker = () => {
//   const { user, initializing, loading }: any = useContext(AuthContext);
//   const [isVerified, setIsVerified] = useState(false); // Local state for verification status
//   const [isLoading, setIsLoading] = useState(true); // Track loading state

//   // console.log( {user} );

//   useEffect(() => {
//     const checkEmailVerification = async () => {
//       if (user && user._auth && user._auth.currentUser) {
//         try {
//           // Reload user to get the latest email verification status
//           await user._auth.currentUser.reload(); // Use the correct `currentUser`
//           const updatedUser = user._auth.currentUser;

//           // Update verification state based on emailVerified
//           if (updatedUser.emailVerified) {
//             setIsVerified(true); // Email is verified
//           } else {
//             setIsVerified(false); // Email not verified
//           }
//           setIsLoading(false); // Stop loading once verification is checked
//         } catch (error) {
//           console.error("Error checking email verification:", error);
//           setIsLoading(false); // Stop loading on error
//         }
//       } else {
//         setIsLoading(false); // If no user, stop loading and show sign in
//       }
//     };

//     if (!initializing && !loading) {
//       checkEmailVerification();
//     }
//   }, [user, initializing, loading]);

//   // Show a loading screen if the app is still initializing or checking user status
//   if (initializing || loading || isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator color="red" size="large" />
//       </View>
//     );
//   }

//   // If the user is not logged in, show SignInScreen
//   if (!user) {
//     return <SignInScreen />;
//   }

//   // If the user is logged in but email is not verified, show VerificationScreen
//   if (!isVerified) {
//     return <VerificationScreen />;
//   }

//   // If user is verified, show HomeStack (main content)
//   return <HomeStack />;
// };

// export default AuthChecker;

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
// });

import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Button, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

import auth from "@react-native-firebase/auth";
import SignInScreen from "../screens/SignInscreen";
import HomeStack from "../navigation/HomeStack";

const VerificationScreen = () => {
  const { user,addUserToFirestoreAfterVerification }:any = useContext(AuthContext);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);


  console.log({ user })
  console.log({isEmailVerified})

  // Check email verification status
  useEffect(() => {
    const checkVerification = async () => {
      if (user) {
        await auth().currentUser?.reload(); // Ensure the current user is updated
        const isVerified = auth().currentUser?.emailVerified || false;
        setIsEmailVerified(isVerified);

        if (isVerified) {
          // Add user to Firestore only when email is verified
          addUserToFirestoreAfterVerification();
        }
      }
    };
    if (user) {
      checkVerification();
    }
  }, [user]);

  if (!user) {
    return <SignInScreen />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking verification...</Text>
      </View>
    );
  }

  return isEmailVerified ? (
    <HomeStack />
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>
        Please verify your email to access the app. Check your email inbox for the verification link.
      </Text>
      <Button
        title="Resend Verification Email"
        onPress={async () => {
          setLoading(true);
          try {
            await auth().currentUser?.sendEmailVerification();
            Alert.alert("Verification Email Sent", "Please check your inbox.");
          } catch (error:any) {
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "black",
  },
});

export default VerificationScreen;
