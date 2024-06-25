import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Slot,Stack} from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:true}}/>
      <Stack.Screen name="hello" options={{headerShown:false}}/>
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