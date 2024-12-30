import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Notifictionscreen from './ResultScreen';
import { AuthContext } from '../context/AuthContext';

function Generationscreen() {
  const [promt, setprompt] = useState('')  
    const {user}: any = useContext(AuthContext);
    
  
  console.log(user.uid)
    const {navigate}:any = useNavigation()

    const naviagtetoResultscreen = () => {
    navigate('NotificationScreen',{promt:promt})
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate a Video</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter details" 
        placeholderTextColor="#999"
        textAlignVertical='top'
        onChangeText={(val) => setprompt(val)}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={naviagtetoResultscreen}
      >
        <Text style={styles.buttonText}>Generate a Video</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Generationscreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderWidth:2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
