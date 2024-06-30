import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user has seen onboarding screens
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding')
      
      if (hasSeenOnboarding) {
        // Check if user is logged in
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
        if (isLoggedIn) {
          // Redirect to home screen or main app screen
          router.replace('home')
        } else {
          // Redirect to login screen
          router.replace('login')
        }
      } else {
        // Redirect to onboarding screens
        router.replace('/onboarding/screen1')
      }
    }

    initializeApp()
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

