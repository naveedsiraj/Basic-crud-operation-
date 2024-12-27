// import React, { useContext, useState } from 'react';
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
// import { AuthContext } from '../context/AuthContext';

// const SignInScreen = () => {
//   const { handleCreateAccount, handleSignInWithEmailAndPassword,handleForgotPassword }: any = useContext(AuthContext);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // State to manage loading indicator

//   // Function to handle sign-in
//   const login = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill out both email and password fields.');
//       return;
//     }

//     setLoading(true); // Show loading indicator
//     try {
//       await handleSignInWithEmailAndPassword(email, password);
//     } catch (error: any) {
//       Alert.alert('Sign-In Error', error.message);
//     } finally {
//       setLoading(false); // Hide loading indicator
//     }
//   };

//   // Function to handle account creation
//   const signUp = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill out both email and password fields.');
//       return;
//     }

//     setLoading(true); // Show loading indicator
//     try {
//       await handleCreateAccount(email, password);
//     } catch (error: any) {
//       Alert.alert('Sign-Up Error', error.message);
//     } finally {
//       setLoading(false); // Hide loading indicator
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign In</Text>

      
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={(text) => setEmail(text)}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//         secureTextEntry
//       />
//       {loading ? ( // Show loading spinner if `loading` is true
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <TouchableOpacity style={styles.button} onPress={login}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={signUp}>
//             <Text style={styles.buttonText}>Sign Up</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.forgetpassword} onPress={}>
//             <Text style={{color:'#007bff'}}>forgetpassword</Text>
//             </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     backgroundColor: '#fff',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   forgetpassword: {
//     padding:8,
//   }
// });

// export default SignInScreen;
import React, { useContext, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SignInScreen = () => {
  const { handleCreateAccount, handleSignInWithEmailAndPassword, handleForgotPassword }: any = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility

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

  // Function to handle forgot password
  const forgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      await handleForgotPassword(email);
      Alert.alert('Success', 'Password reset link sent! Check your email.');
      setIsModalVisible(false); // Close the modal after success
    } catch (error: any) {
      Alert.alert('Password Reset Error', error.message);
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

          {/* Forgot Password Button */}
          <TouchableOpacity
            style={styles.forgetPasswordButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ color: '#007bff' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal for Forget Password */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter your email to reset password</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={forgotPassword}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  forgetPasswordButton: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default SignInScreen;
