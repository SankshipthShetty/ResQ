import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="1_HomePage" options={{ headerShown: false }} />
        <Stack.Screen name="2_CamPermission" options={{ headerShown: false }} />
        <Stack.Screen name="3_CamView" options={{ headerShown: false }} />
        <Stack.Screen name="4_ReportForm" options={{ headerShown: false }} />
        <Stack.Screen name="5_DisasterReports" options={{ headerShown: false }} />
        <Stack.Screen name="6_ShelfLife" options={{ headerShown: false }} />
        <Stack.Screen name="7_DonationReports" options={{ headerShown: false }} />
        <Stack.Screen name="8_DonationDescription" options={{ headerShown: false }} />
        {/* <Stack.Screen name="9_PaymentGateway" options={{ headerShown: false }} /> */}
        <Stack.Screen name="10_BloodDonations" options={{ headerShown: false }} />
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
