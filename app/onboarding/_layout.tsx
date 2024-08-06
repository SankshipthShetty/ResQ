import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const OnboardingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="screen1" options={{ headerShown: false }} />
      <Stack.Screen name="screen2" options={{ headerShown: false }} />
    </Stack>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingLayout;
