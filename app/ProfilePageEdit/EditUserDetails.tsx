import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../constants/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EditUserDetailsScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityTownVillage, setCityTownVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        if (!storedUserId) {
          Alert.alert('Error', 'User ID not found in AsyncStorage.');
          return;
        }

        const docRef = doc(firestore, 'UserData', storedUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.FirstName);
          setLastName(userData.LastName);
          setEmail(userData.Email);
          setPhoneNumber(userData.PhoneNumber);
          setCityTownVillage(userData.CityTownVillage);
          setDistrict(userData.District);
          setState(userData.State);
          setStreet(userData.Street);
          setPincode(userData.Pincode);
        } else {
          Alert.alert('Error', 'User details not found.');
        }
      } catch (error: any) {
        console.error('Error fetching user details:', error.message);
        Alert.alert('Error', 'Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('UserId');
      if (!storedUserId) {
        Alert.alert('Error', 'User ID not found in AsyncStorage.');
        return;
      }

      const userDocRef = doc(firestore, 'UserData', storedUserId);
      await updateDoc(userDocRef, {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PhoneNumber: phoneNumber,
        CityTownVillage: cityTownVillage,
        District: district,
        State: state,
        Street: street,
        Pincode: pincode,
      });

      console.log('User details updated successfully');
      router.push({
        pathname: './UserProf',
        params: { userId: storedUserId },
      });
    } catch (error: any) {
      console.error('Error updating user details:', error.message);
      Alert.alert('Error', 'Failed to update user details.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit User Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={text => setFirstName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={text => setLastName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>City/Town/Village</Text>
        <TextInput
          value={cityTownVillage}
          onChangeText={text => setCityTownVillage(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>District</Text>
        <TextInput
          value={district}
          onChangeText={text => setDistrict(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>State</Text>
        <TextInput
          value={state}
          onChangeText={text => setState(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Street</Text>
        <TextInput
          value={street}
          onChangeText={text => setStreet(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          value={pincode}
          onChangeText={text => setPincode(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
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
    backgroundColor: '#fff',
    color: '#495057',
  },
  updateButton: {
    backgroundColor: '#A53821',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditUserDetailsScreen;
