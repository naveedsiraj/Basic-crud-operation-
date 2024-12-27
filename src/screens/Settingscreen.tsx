import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settingscreen = () => {

    const { user, handleSignOut, deleteUser }: any = useContext(AuthContext);
  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteUser() }
    ]);

    
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => handleSignOut() }
    ]);
  };

  return (
    <View style={styles.container}>

      <View style={{
        flexDirection: "row",
        marginVertical: 20,
        alignItems:"center"
      }}>
      <Text style={{fontSize:18,fontWeight:"600"}}> Email:</Text>
      <Text style={{fontSize:15,fontWeight:"600"}}> {user.email}</Text>
      </View>

      <View style={{
        flexDirection: "row",
        alignItems:"center"
      }}>
      <Text style={{fontSize:18,fontWeight:"600"}}> Name:</Text>
      <Text style={{fontSize:15,fontWeight:"600"}}>  Welcome, {user?.displayName || "anonymous user"}!</Text>
      </View>
  

      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settingscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ff4d4d', // Red color for delete button
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
  },
});
