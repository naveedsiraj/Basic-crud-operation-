import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeStack from './src/navigation/HomeStack'
import { NavigationContainer } from '@react-navigation/native'

import { AuthProvider } from './src/context/AuthContext'
import AuthChecker from './src/AuthChecker/AuthChecker'

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
      <AuthChecker/>
      </AuthProvider>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})