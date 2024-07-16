// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// const App = () => {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//         if (isLoggedIn === 'true') {
//           // Redirect to user's home page
//           router.replace('../User/1_HomePage'); // Adjust the path according to your structure
//         } else {
//           // Redirect to onboarding or login screen
//           router.replace('./onboarding/screen1'); // Adjust the path according to your structure
//         }
//       } catch (e) {
//         console.error('Failed to load login status:', e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

// };

// export default App;


import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const App = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const userRole = await AsyncStorage.getItem('UserRole');
        
        if (isLoggedIn === 'true' && userRole) {
          navigateToRoleBasedScreen(userRole);
        } else {
          // Redirect to onboarding or login screen
          router.replace('./onboarding/screen1'); // Adjust the path according to your structure
        }
      } catch (e) {
        console.error('Failed to load login status:', e);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const navigateToRoleBasedScreen = (role:any) => {
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
        router.replace('./onboarding/screen1'); // Adjust the path according to your structure
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
