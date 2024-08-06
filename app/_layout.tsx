import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack>
      
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

      <Stack.Screen name="auth" options={{ headerShown: false }} />

      <Stack.Screen name="MiddleBody" options={{ headerShown: false }} />

      <Stack.Screen name="Offline" options={{ headerShown: false }} />

      <Stack.Screen name="ProfilePageEdit" options={{ headerShown: false }} />

      <Stack.Screen name="RescueTeams" options={{ headerShown: false }} />

      <Stack.Screen name="User" options={{ headerShown: false }} />

    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
