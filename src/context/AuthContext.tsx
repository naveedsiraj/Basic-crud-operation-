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
  handleCreateAccount: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  deleteUser: () => Promise<void>;
  addUserToFirestoreAfterVerification: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {

      console.log({authUser})
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

 // Sign in with email and password
const handleSignInWithEmailAndPassword = async (email: string, password: string) => {
  setLoading(true);
  try {
    // Sign in with email and password
    await auth().signInWithEmailAndPassword(email, password);

    const currentUser = auth().currentUser;
    if (currentUser) {
      // Check if the user exists in Firestore
      const userDocRef = firestore().collection("users").doc(currentUser.uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        // User exists in Firestore, proceed with login
        console.log("User exists in Firestore, proceeding with login.");
      } else {
        // User does not exist in Firestore, show error
        Alert.alert("Error", "User not found in Firestore. Please register.");
        // Optionally, sign out the user if they don't exist in Firestore
        await auth().signOut();
      }
    }
  } catch (error: any) {
    Alert.alert("Login Error", error.message);
  } finally {
    setLoading(false);
  }
};


  // Create a new account
  const handleCreateAccount = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification();
      Alert.alert("Account Created", "Please verify your email before logging in.");
    } catch (error:any) {
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await auth().signOut();
    } catch (error:any) {
      Alert.alert("Logout Error", error.message);
    } finally {
      setLoading(false);
    }
  };


  // Delete the user
  const deleteUser = async () => {
    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        // First delete user from Firestore
        const userDocRef = firestore().collection("users").doc(currentUser.uid);
        await userDocRef.delete();
        
        // Now delete the user from Firebase Auth
        await currentUser.delete();
        Alert.alert("User Deleted", "Your account has been deleted.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add user to Firestore after email verification
  const addUserToFirestoreAfterVerification = async () => {
    setLoading(true);
    try {
      await auth().currentUser?.reload(); // Reload user state to check email verification
      const updatedUser = auth().currentUser;

      if (updatedUser?.emailVerified) {
        await firestore().collection("users").doc(updatedUser.uid).set({
          email: updatedUser.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert("Welcome", "Your email has been verified. You are now registered.");
      } else {
        Alert.alert("Verification Error", "Please verify your email before proceeding.");
      }
    } catch (error:any) {
      Alert.alert("Firestore Error", error.message);
    } finally {
      setLoading(false);
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
        addUserToFirestoreAfterVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
