// //camera 

// import React, { useState } from 'react';
// import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import { launchCamera } from 'react-native-image-picker';

// export default function ReportScreen({ history }) {
//   const [imageUri, setImageUri] = useState(null);
//   const [description, setDescription] = useState('');

//   const handleCameraLaunch = () => {
//     launchCamera({ mediaType: 'mixed' }, response => {
//       if (response.assets && response.assets.length > 0) {
//         setImageUri(response.assets[0].uri);
//       }
//     });
//   };

//   const handleSubmit = () => {
//     // Handle submission logic
//     console.log({ imageUri, description });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Report a Disaster</Text>
//       <TouchableOpacity style={styles.button} onPress={handleCameraLaunch}>
//         <Text style={styles.buttonText}>Capture Image/Video</Text>
//       </TouchableOpacity>
//       {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
//       <TextInput
//         style={styles.input}
//         placeholder="Describe the incident..."
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#A52A2A',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginBottom: 20,
//   },
//   input: {
//     height: 100,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     textAlignVertical: 'top',
//     marginBottom: 20,
//   },
//   submitButton: {
//     backgroundColor: '#A52A2A',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });
