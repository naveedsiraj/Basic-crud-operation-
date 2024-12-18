import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SignInScreen = () => {
  const { handleCreateAccount, handleSignInWithEmailAndPassword }: any = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading indicator

  // Function to handle sign-in
  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out both email and password fields.');
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      await handleSignInWithEmailAndPassword(email, password);
    } catch (error: any) {
      Alert.alert('Sign-In Error', error.message);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to handle account creation
  const signUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out both email and password fields.');
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      await handleCreateAccount(email, password);
    } catch (error: any) {
      Alert.alert('Sign-Up Error', error.message);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      {loading ? ( // Show loading spinner if `loading` is true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignInScreen;
