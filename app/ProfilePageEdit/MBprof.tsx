// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
// import { getDoc, doc } from 'firebase/firestore';
// import { firestore } from '../../constants/firebaseConfig';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserDetailsScreen = () => {
//   const router = useRouter();
//   const { userId } = useLocalSearchParams();
//   const [userDetails, setUserDetails] = useState<any>({});

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         let storedUserId: string | null = null;

//         if (typeof userId === 'string') {
//           storedUserId = userId;
//         } else {
//           storedUserId = await AsyncStorage.getItem('MiddleId');
//         }

//         if (storedUserId) {
//           const docRef = doc(firestore, 'MiddleBodyData', storedUserId);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setUserDetails(docSnap.data());
//           } else {
//             Alert.alert('Error', 'User details not found.');
//           }
//         } else {
//           Alert.alert('Error', 'Organisation ID not found.');
//         }
//       } catch (error: any) {
//         console.error('Error fetching user details:', error.message);
//         Alert.alert('Error', 'Failed to fetch user details.');
//       }
//     };

//     fetchUserDetails();
//   }, [userId]);

//   const handleEdit = () => { 
//     router.push({
//       pathname: './EditMBDetails',
//       params: { userId}
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
        
//         <Image
//           source={require('../../assets/images/userprof.png')} // Adjust the path to your image
//           style={styles.headerImage}
//         />
//         <Text style={styles.header}>Organisation Details</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Name</Text>
//           <TextInput
//             style={styles.input}
//             value={userDetails.organizationName}
//             editable={false}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Adress</Text>
//           <TextInput
//             style={styles.input}
//             value={userDetails.address}
//             editable={false}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={styles.input}
//             value={userDetails.email}
//             editable={false}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             value={userDetails.phoneNumber}
//             editable={false}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Type of Organisation</Text>
//           <TextInput
//             style={styles.input}
//             value={userDetails.typeOfOrganization}
//             editable={false}
//           />
//         </View>
        
        
       
//       </View>
//       <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
//         <Text style={styles.saveButtonText}>Edit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//   },
//   header: {
//     fontSize: 34,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   detailsContainer: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//   },
//   inputContainer: {
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
//     backgroundColor: '#e9ecef',
//     color: '#495057',
//   },
//   saveButton: {
//     backgroundColor: '#A53821',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerImage: {
//     width: 60,
//     height: 50,
//   },
// });

// export default UserDetailsScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../constants/firebaseConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetailsScreen = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState<any>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let storedUserId: string | null = null;

        if (typeof userId === 'string') {
          storedUserId = userId;
        } else {
          storedUserId = await AsyncStorage.getItem('MiddleId');
        }

        console.log('Stored User ID:', storedUserId); // Logging the User ID

        if (storedUserId) {
          const docRef = doc(firestore, 'MiddleBodyData', storedUserId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('User Details:', docSnap.data()); // Logging fetched data
            setUserDetails(docSnap.data());
          } else {
            Alert.alert('Error', 'User details not found.');
          }
        } else {
          Alert.alert('Error', 'Organisation ID not found.');
        }
      } catch (error: any) {
        console.error('Error fetching user details:', error.message);
        Alert.alert('Error', 'Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleEdit = () => {
    // Pass the correct storedUserId to the Edit screen
    router.push({
      pathname: './EditMBDetails',
      params: { storedUserId: userId } // Corrected line
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/userprof.png')} // Adjust the path to your image
          style={styles.headerImage}
        />
        <Text style={styles.header}>Organisation Details</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={userDetails['Organization Name']} // Ensure the key matches your Firestore field
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={userDetails.Address} // Ensure the key matches your Firestore field
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userDetails.Email} // Ensure the key matches your Firestore field
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userDetails['Phone Number']} // Ensure the key matches your Firestore field
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type of Organisation</Text>
          <TextInput
            style={styles.input}
            value={userDetails['Type of Organization']} // Ensure the key matches your Firestore field
            editable={false}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
        <Text style={styles.saveButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#e9ecef',
    color: '#495057',
  },
  saveButton: {
    backgroundColor: '#A53821',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: 60,
    height: 50,
  },
});

export default UserDetailsScreen;
