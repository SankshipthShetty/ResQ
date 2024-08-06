import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="MainSignup" options={{ headerShown: false }} />
        <Stack.Screen name="MiddleBodySignUp" options={{ headerShown: false }} />
        <Stack.Screen name="RescueTeamSignUp" options={{ headerShown: false }} />
        <Stack.Screen name="UserSignUp" options={{ headerShown: false }} />
    </Stack>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default AuthLayout;