import React, { createContext, useEffect, useState, ReactNode } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

// Define AuthContext type
interface AuthContextType {
  user: any;
  loading: boolean;
  initializing: boolean;
  handleSignInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  handleCreateAccount: (email: string, password: string, displayName: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  deleteUser: () => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);


    // Listen to auth state changes
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
        if (initializing) setInitializing(false);
  
        if (firebaseUser) {
          const userRef = firestore().collection("users").doc(firebaseUser.uid);
          const doc = await userRef.get();
  
          if (!doc.exists) {
            await addUserToDatabase(firebaseUser, firebaseUser.displayName || "anonymous user");
          }
  
          setUser({
            ...firebaseUser,
            ...doc.data(),
          });
        } else {
          setUser(null);
        }
      });
  
      return subscriber; // Cleanup subscription on unmount
    }, []);

  
  // Function to add user to Firestore
  const addUserToDatabase = async (firebaseUser: any) => {
    try {
      const userRef = firestore().collection("users").doc(firebaseUser.uid);
      await userRef.set({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:"anonymous user",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("User added to Firestore");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  };

  // Handle user creation with display name
  const handleCreateAccount = async (email: string, password: string,) => {
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {

        await addUserToDatabase(firebaseUser);
        setUser({
          ...firebaseUser,
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleSignInWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to sign in");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to sign out");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const deleteUser = async () => {
    setLoading(true);
    try {
      const firebaseUser = auth().currentUser;
      const userRef = firestore().collection("users").doc(firebaseUser?.uid);
      await userRef.delete();
      await firebaseUser?.delete();
      setUser(null);
      Alert.alert("Account Deleted", "Your account has been deleted successfully.");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


   // Handle password reset
   const handleForgotPassword = async (email: string) => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Success", "Password reset email sent. Please check your inbox.");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send reset password email. Please try again.");
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing,
        handleSignInWithEmailAndPassword,
        handleCreateAccount,
        handleSignOut,
        deleteUser,
        handleForgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
