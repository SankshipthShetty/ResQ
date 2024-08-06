import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="Offlinep1" options={{ headerShown: false }} />
        <Stack.Screen name="offlinep2" options={{ headerShown: false }} />
        <Stack.Screen name="offlinep3" options={{ headerShown: false }} />
        <Stack.Screen name="offlinep4" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
