


import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Network from 'expo-network';

export default function NetworkErrorScreen() {
  const router = useRouter();
  const [isWifiEnabled, setIsWifiEnabled] = useState<boolean | undefined>(false);

  const openWiFiSettings = () => {
    IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS);
  };

  const openBluetoothSettings = () => {
    IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS);
  };

  const checkWifiStatus = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsWifiEnabled(networkState.isConnected && networkState.type === Network.NetworkStateType.WIFI);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkWifiStatus();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (isWifiEnabled) {
      router.push("./offlinep4");
    } else {
      Alert.alert("WiFi Required", "Please turn on your WiFi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.networkErrorText}>Offline Connection!!</Text>
      
      <View style={styles.bluetoothContainer}>
        <Text style={styles.bluetoothSubText}>Allow ResQ to access your Bluetooth and Wifi?</Text>
        
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={require('../../assets/images/Bluetooth.png')} />
            <TouchableOpacity style={styles.allowButton} onPress={openBluetoothSettings}>
              <Text style={styles.buttonText}>Turn on Bluetooth</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={require('../../assets/images/Wifiimg.png')} />
            <TouchableOpacity style={styles.allowButton} onPress={openWiFiSettings}>
              <Text style={styles.buttonText}>Turn on WiFi</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => router.push("./Offlinep1")}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  networkErrorText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 50,
    textAlign: 'center',
  },
  bluetoothContainer: {
    width: '80%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },
  bluetoothSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    top: 50,
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
  },
  allowButton: {
    backgroundColor: '#ADD8E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 55,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#A52A2A',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 90,
    marginBottom: 10,
  },
  skipButton: {
    borderColor: '#A52A2A',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  skipButtonText: {
    color: '#A52A2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});




// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import * as IntentLauncher from 'expo-intent-launcher';
// import * as Network from 'expo-network';
// import * as Bluetooth from 'expo-bluetooth';

// export default function NetworkErrorScreen() {
//   const router = useRouter();
//   const [isWiFiOn, setIsWiFiOn] = useState(false);
//   const [isBluetoothOn, setIsBluetoothOn] = useState(false);

//   useEffect(() => {
//     const checkWiFi = async () => {
//       try {
//         const networkState = await Network.getNetworkStateAsync();
//         setIsWiFiOn(networkState.type === Network.NetworkStateType.WIFI);
//       } catch (error) {
//         console.error('Error checking WiFi state:', error);
//       }
//     };

//     const checkBluetooth = async () => {
//       try {
//         const bluetoothState = await Bluetooth.getEnabledAsync();
//         setIsBluetoothOn(bluetoothState);
//       } catch (error) {
//         console.error('Error checking Bluetooth state:', error);
//       }
//     };

//     checkWiFi();
//     checkBluetooth();
//   }, []);

//   const openWiFiSettings = () => {
//     IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS);
//   };

//   const openBluetoothSettings = () => {
//     IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS);
//   };

//   const handleContinue = () => {
//     if (isWiFiOn && isBluetoothOn) {
//       router.push('./offlinep4');
//     } else {
//       Alert.alert('Please turn on both WiFi and Bluetooth to continue.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.networkErrorText}>Offline Connection!!</Text>

//       <View style={styles.bluetoothContainer}>
//         <Text style={styles.bluetoothSubText}>Allow ResQ to access your Bluetooth and Wifi?</Text>

//         <View style={styles.iconRow}>
//           <View style={styles.iconContainer}>
//             <Image style={styles.icon} source={require('../../assets/images/Bluetooth.png')} />
//             <TouchableOpacity style={styles.allowButton} onPress={openBluetoothSettings}>
//               <Text style={styles.buttonText}>Turn on Bluetooth</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.iconContainer}>
//             <Image style={styles.icon} source={require('../../assets/images/Wifiimg.png')} />
//             <TouchableOpacity style={styles.allowButton} onPress={openWiFiSettings}>
//               <Text style={styles.buttonText}>Turn on WiFi</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//           <Text style={styles.buttonText}>Continue</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.skipButton} onPress={() => router.push('./Offlinep1')}>
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
//     height: '60%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 30,
//     elevation: 3,
//   },
//   bluetoothSubText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#666',
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 20,
//     top: 50,
//   },
//   iconContainer: {
//     alignItems: 'center',
//   },
//   icon: {
//     width: 120,
//     height: 100,
//     marginBottom: 10,
//     borderRadius: 50,
//   },
//   allowButton: {
//     backgroundColor: '#ADD8E6',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 55,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   continueButton: {
//     backgroundColor: '#A52A2A',
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     borderRadius: 5,
//     marginTop: 90,
//     marginBottom: 10,
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


