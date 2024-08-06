import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
        {/* <Stack.Screen name="EditMBDetails" options={{ headerShown: false }} />
        <Stack.Screen name="EditRescueDetails" options={{ headerShown: false }} /> */}
        <Stack.Screen name="EditUserDetails" options={{ headerShown: false }} />
        <Stack.Screen name="MBprof" options={{ headerShown: false }} />
        {/* <Stack.Screen name="RescueProf" options={{ headerShown: false }} /> */}
        <Stack.Screen name="UserProf" options={{ headerShown: false }} />
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
