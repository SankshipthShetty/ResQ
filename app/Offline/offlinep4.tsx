// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
// import { NetworkInfo } from 'react-native-network-info';

// const WifiInfoPage = () => {
//   const [serverIpAddress, setServerIpAddress] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [response, setResponse] = useState('');
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location to get WiFi information',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           fetchIpAddress();
//         } else {
//           console.error('Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     } else {
//       fetchIpAddress();
//     }
//   };

//   const fetchIpAddress = async () => {
//     setLoading(true);
//     try {
//       const ip = await NetworkInfo.getIPV4Address();
//       // Assuming device's IP is 192.168.4.x
//       if (ip.startsWith('192.168.4.')) {
//         setIsConnected(true);
//         discoverServer(ip);
//       } else {
//         setIsConnected(false);
//       }
//     } catch (error) {
//       console.error('Failed to get IP address:', error);
//       setIsConnected(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const discoverServer = async (deviceIp:any) => {
//     const subnet = deviceIp.substring(0, deviceIp.lastIndexOf('.'));
//     console.log(subnet)
//     let found = false;
//     for (let i = 1; i < 255; i++) {
//       const ip = `${subnet}.${i}`;
//       try {
        
//         const response = await fetch(`http://${ip}/status`, { method: 'GET' });
//         if (response.ok) {
//           setServerIpAddress(ip);
//           found = true;
//           setResponse('Successfully connected to server.');
//           break;
//         }
//       } catch (error) {
//         // Server not found at this IP
//       }
//     }
//     if (!found) {
//       Alert.alert('Server not found', 'Could not discover the server IP.');
//     } else {
//       sendTestMessage();
//     }
//   };

//   const sendTestMessage = async () => {
//     if (serverIpAddress) {
//       try {
//         const url = `http://${serverIpAddress}/send?message=${encodeURIComponent('Test Message')}`;
//         const response = await fetch(url, {
//           method: 'GET',
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.text();
//         setResponse(`Test message sent successfully: ${result}`);
//       } catch (error) {
//         console.error('Failed to send test message:', error);
//         setResponse('Failed to send test message. Please ensure you are connected to the LoRa Transmitter to send the SOS signal.');
//       }
//     } else {
//       setResponse('Server IP address is missing');
//     }
//   };

//   const handleSendMessage = async () => {
//     if (isConnected) {
//       sendTestMessage();
//     } else {
//       Alert.alert('Network Info', 'Ensure you are on the same local network as your IoT device.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>LoRa Device Info</Text>
//       {loading ? (
//         <Text style={styles.info}>Loading...</Text>
//       ) : (
//         <Text style={styles.info}>LoRa found at IP Address: {serverIpAddress}</Text>
//       )}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your message"
//           value={message}
//           onChangeText={setMessage}
//         />
//       </View>
//       <TouchableOpacity style={styles.sosButton} onPress={handleSendMessage}>
//         <Text style={styles.sosButtonText}>SOS</Text>
//       </TouchableOpacity>
//       {response ? <Text style={styles.response}>{response}</Text> : null}
//       <TouchableOpacity style={styles.refreshButton} onPress={fetchIpAddress}>
//         <Text style={styles.refreshButtonText}>Refresh IP</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     fontWeight: 'bold',
//   },
//   info: {
//     fontSize: 18,
//     marginBottom: 16,
//   },
//   inputContainer: {
//     width: '80%',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     width: '100%',
//     paddingHorizontal: 8,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//   },
//   sosButton: {
//     backgroundColor: '#A52A2A',
//     borderRadius: 100, // Makes it round
//     width: 200,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   sosButtonText: {
//     color: '#fff',
//     fontSize: 32,
//     fontWeight: 'bold',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//   },
//   response: {
//     marginTop: 16,
//     fontSize: 18,
//     color: 'green',
//   },
//   refreshButton: {
//     backgroundColor: '#A52A2A',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginTop: 35,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default WifiInfoPage;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
// import { NetworkInfo } from 'react-native-network-info';

// const WifiInfoPage = () => {
//   const [serverIpAddress, setServerIpAddress] = useState('192.168.4.1'); // Default IP for your IoT device
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [response, setResponse] = useState('');
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location to get WiFi information',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           fetchIpAddress();
//         } else {
//           console.error('Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     } else {
//       fetchIpAddress();
//     }
//   };

//   const fetchIpAddress = async () => {
//     setLoading(true);
//     try {
//       setServerIpAddress('192.168.4.1');
//       // const ip = await NetworkInfo.getIPV4Address();
//       // setServerIpAddress(ip || '192.168.4.1')
//        // Default to IoT device IP if none found
//     } catch (error) {
//       console.error('Failed to get IP address:', error);
//       setServerIpAddress('192.168.4.1'); // Default to IoT device IP on error
//     } finally {
//       setLoading(false);
//     }
//   };
//   const sendTestMessage = async () => {
//     if (serverIpAddress) {
//       try {
//         const url = `http://${serverIpAddress}/send?message=${encodeURIComponent('Test Message')}`;
//         const response = await fetch(url, {
//           method: 'GET',
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.text();
//         setResponse(`Test message sent successfully: ${result}`);
//       } catch (error) {
//         console.error('Failed to send test message:', error);
//         setResponse('Failed to send test message. Please ensure you are connected to the LoRa Transmitter to send the SOS signal.');
//       }
//     } else {
//       setResponse('Server IP address is missing');
//     }
//   };

//   const handleSendMessage = async () => {
//     if (isConnected) {
//       sendTestMessage();
//     } else {
//       Alert.alert('Network Info', 'Ensure you are on the same local network as your IoT device.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>LoRa Device Communication</Text>
//       {loading ? (
//         <Text style={styles.info}>Loading...</Text>
//       ) : (
//         <Text style={styles.info}>Server IP Address: {serverIpAddress}</Text>
//       )}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your message"
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Send Test Message" onPress={handleSendMessage} />
//       {response ? <Text style={styles.response}>{response}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//   },
//   info: {
//     fontSize: 18,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     width: '80%',
//     marginBottom: 16,
//     paddingLeft: 8,
//   },
//   response: {
//     marginTop: 16,
//     fontSize: 18,
//     color: 'green',
//   },
// });

// export default WifiInfoPage;


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

const WifiInfoPage = () => {
  const [ipAddress, setIpAddress] = useState('192.168.4.1'); // Default IP for your IoT device
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to get WiFi information',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchIpAddress();
        } else {
          console.error('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      fetchIpAddress();
    }
  };

  const fetchIpAddress = async () => {
    setLoading(true);
    try {
      const ip = await NetworkInfo.getIPV4Address();
      setIpAddress(ip || '192.168.4.1')
      setIpAddress('192.168.4.1'); // Default to IoT device IP if none found
    } catch (error) {
      console.error('Failed to get IP address:', error);
      setIpAddress('192.168.4.1'); // Default to IoT device IP on error
    } finally {
      setLoading(false);
    }
  };
  const sendMessage = async () => {
    if (ipAddress && message) {
      try {
        const url = `http://${ipAddress}/send?message=${encodeURIComponent(message)}`;
        const response = await fetch(url, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        setResponse(result);
      } catch (error:any) {
        console.error('Failed to send message:', error);
        setResponse(`Failed to send message: ${error.message}`);
      }
    } else {
      setResponse('IP address or message is missing');
    }
  };

  const handleSendMessage = () => {
    if (isConnected) {
      Alert.alert('Network Info', 'You are connected to the internet. Ensure you are on the same local network as your IoT device.');
    }
    sendMessage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoRa Device Info</Text>
      {loading ? (
        <Text style={styles.info}>Loading...</Text>
      ) : (
        <Text style={styles.info}>LoRa found at IP Address: {ipAddress}</Text>
      )}
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      </View>
      <TouchableOpacity style={styles.sosButton} onPress={handleSendMessage}>
         <Text style={styles.sosButtonText}>SOS</Text>
       </TouchableOpacity>
       {response ? <Text style={styles.response}>{response}</Text> : null}
       <TouchableOpacity style={styles.refreshButton} onPress={fetchIpAddress}>
         <Text style={styles.refreshButtonText}>Refresh IP</Text>
       </TouchableOpacity>
     </View>
   );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    marginBottom: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  sosButton: {
    backgroundColor: '#A52A2A',
    borderRadius: 100, // Makes it round
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  response: {
    marginTop: 16,
    fontSize: 18,
    color: 'green',
  },
  refreshButton: {
    backgroundColor: '#A52A2A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WifiInfoPage;
