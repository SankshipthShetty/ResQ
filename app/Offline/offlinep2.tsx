// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function NetworkErrorScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.networkErrorText}>Offline Connection!!</Text>
      
//       <View style={styles.bluetoothContainer}>
//         <Image style={styles.bluetoothIcon} source={require('../../assets/images/Bluetooth.png')} />

//         <Text style={styles.bluetoothSubText}>Allow ResQ to access your Bluetooth and Wifi?</Text>
        
//         <TouchableOpacity style={styles.allowButton} onPress={() => router.push("./offlinep4")}>
//           <Text style={styles.buttonText}>Allow</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.skipButton} onPress={() => router.push("./Offlinep1")}>
//           <Text style={styles.skipButtonText}>Skip for now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   networkErrorText: {
//     fontSize: 35,
//     fontWeight: 'bold',
//     marginTop: 50,
//     textAlign: 'center',
//   },
//   bluetoothContainer: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 30,
//     elevation: 3,
//   },
//   bluetoothIcon: {
//     width: 180,
//     height: 100,
//     marginBottom: 20,
//     borderRadius: 50,
//   },
//   bluetoothSubText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#666',
//   },
//   allowButton: {
//     backgroundColor: '#A52A2A',
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   skipButton: {
//     borderColor: '#A52A2A',
//     borderWidth: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   skipButtonText: {
//     color: '#A52A2A',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import * as Network from 'expo-network';
// import * as Device from 'expo-device';
// import { BleManager } from 'react-native-ble-plx';


// const NetworkStatus = () => {
//   const [networkState, setNetworkState] = useState<Network.NetworkState | null>(null);  

//   useEffect(() => {
//     const checkNetworkStatus = async () => {
//       try {
//         // Get network state
//         const state = await Network.getNetworkStateAsync();
//         setNetworkState(state);
//       } catch (error) {
//         console.error("Error checking network state:", error);
//         setNetworkState(null);
//       }
//     };

   
//     checkNetworkStatus();
  
//     // Optionally, you can set up a periodic check
//     const interval = setInterval(() => {
//       checkNetworkStatus();
    
//     }, 1000); // Check every 1 second


//     // Cleanup
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   const isWifiEnabled = networkState?.type === Network.NetworkStateType.WIFI;
//   const isBluetoothEnabled = networkState?.type === Network.NetworkStateType.BLUETOOTH;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         Network Status: {networkState === null ? 'Loading...' : isWifiEnabled ? 'Wi-Fi Enabled' : 'Wi-Fi Disabled or Not Connected'}
//       </Text>
//     </View>
//   );  
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//   },
// });

// export default NetworkStatus;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Network from 'expo-network';
import * as IntentLauncher from 'expo-intent-launcher';

const NetworkStatus = () => {
  const [networkState, setNetworkState] = useState<Network.NetworkState | null>(null);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        // Get network state
        const state = await Network.getNetworkStateAsync();
        setNetworkState(state);

        // Show alert if Wi-Fi is disabled and alert hasn't been shown
        if (state.type !== Network.NetworkStateType.WIFI && !alertShown) {
          Alert.alert(
            'Wi-Fi Disabled',
            'Wi-Fi is currently disabled. Would you like to enable it?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Enable', onPress: openWiFiSettings },
            ],
            { cancelable: false }
          );
          setAlertShown(true); // Set the alertShown flag to true after showing the alert
        }
      } catch (error) {
        console.error("Error checking network state:", error);
        setNetworkState(null);
      }
    };

    checkNetworkStatus();

    // Set up a periodic check
    const interval = setInterval(() => {
      checkNetworkStatus();
    }, 1000); // Check every 1 second

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [alertShown]);

  const openWiFiSettings = () => {
    IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS);
  };

  const isWifiEnabled = networkState?.type === Network.NetworkStateType.WIFI;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Network Status: {networkState === null ? 'Loading...' : isWifiEnabled ? 'Wi-Fi Enabled' : 'Wi-Fi Disabled or Not Connected'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default NetworkStatus;
