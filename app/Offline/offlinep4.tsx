// //LoRa
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const ExampleScreen = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');

  const handleUploadPicture = () => {
    // Implement your logic for uploading a picture here
    // For example, you can navigate to a screen for uploading pictures
    //router.push('./UploadPictureScreen');
  };

  const handleWriteDescription = () => {
    // Implement your logic for writing a text description
    // For example, navigate to a screen for writing text
    // router.push('./WriteDescriptionScreen');
  };

  const handleSOS = () => {
    // Implement your logic for SOS functionality
    // This could include sending alerts or triggering actions
    // router.push('./SOSScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Information</Text>
<View style={styles.bluetoothContainer}>
      {/* Button for uploading a picture */}
      <TouchableOpacity style={styles.button} onPress={handleUploadPicture}>
        <Text style={styles.buttonText}>Upload Picture</Text>
      </TouchableOpacity>

      {/* Text input for writing text description */}
      <TextInput
        style={styles.descriptionInput}
        placeholder="Write description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      </View>

      {/* SOS button with special effects */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#A52A2A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionInput: {
    flex: 1,
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top', // Ensures text starts from the top
    backgroundColor: '#ffffff',
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
  bluetoothContainer: {
    width: '80%',
    height:'30%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },

  bluetoothContainer1: {
    flex: 1,
    width: '80%',
    height:'30%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },
});

export default ExampleScreen;


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import * as Network from 'expo-network';

// const WifiInfoPage = () => {
//   const [ipAddress, setIpAddress] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchIpAddress();
//   }, []);

//   const fetchIpAddress = async () => {
//     setLoading(true);
//     try {
//       const ip = await Network.getIpAddressAsync();
//       setIpAddress(ip);
//     } catch (error) {
//       console.error('Failed to get IP address:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Connected Wi-Fi Information</Text>
//       {loading ? (
//         <Text style={styles.info}>Loading...</Text>
//       ) : (
//         <Text style={styles.info}>IP Address: {ipAddress}</Text>
//       )}
//       <Button title="Refresh" onPress={fetchIpAddress} />
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
// });

// export default WifiInfoPage;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import * as Network from 'expo-network';
// import * as NetInfo from '@react-native-community/netinfo';

// const WifiInfoPage = () => {
//   const [ipAddress, setIpAddress] = useState('192.168.4.2'); // Default IP for your IoT device
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [response, setResponse] = useState('');
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     fetchIpAddress();
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const fetchIpAddress = async () => {
//     setLoading(true);
//     try {
//       const ip = await Network.getIpAddressAsync();
//       setIpAddress( '192.168.4.2'); // Default to IoT device IP if none found
//     } catch (error) {
//       console.error('Failed to get IP address:', error);
//       setIpAddress('192.168.4.2'); // Default to IoT device IP on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (ipAddress && message) {
//       try {
//         const response = await fetch(`http://${ipAddress}/send-message`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ message }),
//         });
//         const result = await response.json();
//         setResponse(result.message);
//       } catch (error) {
//         console.error('Failed to send message:', error);
//         setResponse('Failed to send message');
//       }
//     } else {
//       setResponse('IP address or message is missing');
//     }
//   };

//   const handleSendMessage = () => {
//     if (isConnected) {
//       Alert.alert('Network Info', 'You are connected to the internet. Ensure you are on the same local network as your IoT device.');
//     }
//     sendMessage();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Connected Wi-Fi Information</Text>
//       {loading ? (
//         <Text style={styles.info}>Loading...</Text>
//       ) : (
//         <Text style={styles.info}>IP Address: {ipAddress}</Text>
//       )}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your message"
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Send Message" onPress={handleSendMessage} />
//       {response ? <Text style={styles.response}>{response}</Text> : null}
//       <Button title="Refresh IP" onPress={fetchIpAddress} />
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
