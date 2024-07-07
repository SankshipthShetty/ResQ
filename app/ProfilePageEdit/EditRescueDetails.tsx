// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { firestore } from '../../constants/firebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// const EditUserDetailsScreen = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [contactName, setContactName] = useState('');
//   const [address, setAddress] = useState('');
//   const [numMem, setNumMem] = useState('');

//   useEffect(() => {
//     const fetchRescueDetails = async () => {
//       try {
//         const storedRescueId = await AsyncStorage.getItem('RescueId');
//         if (!storedRescueId) {
//           Alert.alert('Error', 'Rescue Team ID not found in AsyncStorage.');
//           return;
//         }

//         const docRef = doc(firestore, 'RescueTeamData', storedRescueId);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const RescueTeamData = docSnap.data();
//           setEmail(RescueTeamData.email);
//           setPhoneNumber(RescueTeamData.phoneNumber);
//           setTeamName(RescueTeamData.teamName);
//           setContactName(RescueTeamData.contactName);
//           setAddress(RescueTeamData.address);
//           setNumMem(RescueTeamData.numMem);
        
//         } else {
//           Alert.alert('Error', 'Rescue team details not found.');
//         }
//       } catch (error: any) {
//         console.error('Error fetching Rescue team details:', error.message);
//         Alert.alert('Error', 'Failed to fetch Rescue team details.');
//       }
//     };

//     fetchRescueDetails();
//   }, []);

//   const handleUpdate = async () => {
//     try {
//       const storedRescueId = await AsyncStorage.getItem('RescueId');
//       if (!storedRescueId) {
//         Alert.alert('Error', 'Rescue Team not found in AsyncStorage.');
//         return;
//       }

//       const userDocRef = doc(firestore, 'RescueTeamData', storedRescueId);
//       await updateDoc(userDocRef, {
      
//         Email: email,
//         PhoneNumber: phoneNumber,
//         TeamName: teamName,
//         ContactName: contactName,
//         Address: address,
//         NumMem: numMem,
//       });

//       console.log('Rescue Team details updated successfully');
//       router.push({
//         pathname: './RescueProf',
//         params: { RescueId: storedRescueId },
//       });
//     } catch (error: any) {
//       console.error('Error updating Rescue Team details:', error.message);
//       Alert.alert('Error', 'Failed to update Rescue Team details.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Edit Rescue Team Details</Text>


//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput

//           value={email}
//           onChangeText={text => setEmail(text)}
//           style={styles.input}
//           placeholderTextColor="#a9a9a9"
//         />
//       </View>

     
       


//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Phone number</Text>
//         <TextInput
//           value={phoneNumber}
//           onChangeText={text => setPhoneNumber(text)}
//           style={styles.input}
//           placeholderTextColor="#a9a9a9"
//         />
//       </View>
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>Team Name</Text>
//             <TextInput
//             value={teamName}
//             onChangeText={text => setTeamName(text)}
//             style={styles.input}
//             placeholderTextColor="#a9a9a9"
//             />
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>Contact Name</Text>
//             <TextInput
//             value={contactName}
//             onChangeText={text => setContactName(text)}
//             style={styles.input}
//             placeholderTextColor="#a9a9a9"
//             />
//             </View>
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Address</Text>
//                 <TextInput
//                 value={address}
//                 onChangeText={text => setAddress(text)}
//                 style={styles.input}
//                 placeholderTextColor="#a9a9a9"
//                 />
//                 </View>
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Number of Members</Text>
//                     <TextInput
//                     value={numMem}
//                     onChangeText={text => setNumMem(text)}
//                     style={styles.input}
//                     placeholderTextColor="#a9a9a9"
//                     />
//                     </View>
            

//       <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
//         <Text style={styles.updateButtonText}>Update Details</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginBottom: 5,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ced4da',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//     backgroundColor: '#fff',
//     color: '#495057',
//   },
//   updateButton: {
//     backgroundColor: '#A53821',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   updateButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default EditUserDetailsScreen;
