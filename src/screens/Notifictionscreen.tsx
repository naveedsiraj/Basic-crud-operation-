import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

const Notifictionscreen = () => {
    const route = useRoute();
    const { notificationData }: any = route.params || {}; 
    
    console.log("=================================")
    console.log('Received Notification Data in Settings:', notificationData);
    console.log("=================================")
  return (
    <View>
      <Text>Notifictionscreen</Text>
    </View>
  )
}

export default Notifictionscreen

const styles = StyleSheet.create({})