import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
const App = () => {


// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        verifyInternetConnection();
      } else {
        router.replace('../Offline/Offlinep1'); // Adjust the path to your LoRa SOS page
        setLoading(false);
      }
    });

    // Initial network status check
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        verifyInternetConnection();
      } else {
        router.replace('../Offline/Offlinep1'); // Adjust the path to your LoRa SOS page
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const verifyInternetConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      if (response.ok) {
        checkLoginStatus();
      } else {
        router.replace('../Offline/Offlinep1');
        setLoading(false);
      }
    } catch (error) {
      router.replace('../Offline/Offlinep1');
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const userRole = await AsyncStorage.getItem('UserRole');
      
      if (isLoggedIn === 'true' && userRole) {
        navigateToRoleBasedScreen(userRole);
      } else {
        // Redirect to onboarding or login screen
        router.replace('../onboarding/screen1'); // Adjust the path according to your structure
      }
    } catch (e) {
      console.error('Failed to load login status:', e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRoleBasedScreen = (role: any) => {
    switch (role) {
      case 'User':
        router.replace('../User/1_HomePage'); // Adjust the path according to your structure
        break;
      case 'RescueTeam':
        router.replace('../RescueTeams/0_HomePage'); // Adjust the path according to your structure
        break;
      case 'MiddleBody':
        router.replace('../MiddleBody/0_HomePage'); // Adjust the path according to your structure
        break;
      default:
        router.replace('../onboarding/screen1'); // Adjust the path according to your structure
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default App;
