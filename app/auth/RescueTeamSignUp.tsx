import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert ,Image,Pressable,ActivityIndicator} from 'react-native';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, firestore, createUser } from '../../constants/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useRouter} from 'expo-router';
import debounce from 'lodash.debounce';
import * as Location from 'expo-location';


//import logo from '../../assets/images/image10.png';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const router = useRouter();
  const [email, setEmailID] = useState('');
  const [phoneNumber, setContactNumber] = useState('');
  const [teamName, setTeamName] = useState('');
  const [contactName, setContactName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [numMem, setNoOfMembers] = useState('');
  const [role, setRole] = useState('RescueTeam');
  const [emailError, setEmailError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);

  const [useManualLocation, setUseManualLocation] = useState(false); // Toggle between manual and current location input
  const [manualLocation, setManualLocation] = useState(''); 


  const checkIfUserExists = async (email: string) => {
    const collections = ["UserData", "RescueTeamData", "MiddleBodyData"]; // Replace with your collection names
    for (const collectionName of collections) {
      const userQuery = query(collection(firestore, collectionName), where("Email", "==", email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        return true; // User exists in this collection
      }
    }
    return false; // User does not exist in any collection
  };
  
  const debouncedCheckIfUserExists = useCallback(
    debounce(async (email: string) => {
      if (email.includes('@gmail.com')) {
        const userExists = await checkIfUserExists(email);
        if (userExists) {
          setEmailError("An account with this email already exists.");
        } else {
          setEmailError("");
        }
      }
    }, 500), // Debounce delay in milliseconds
    []
  );

  const handleEmailChange = (text: string) => {
    setEmailID(text);
    debouncedCheckIfUserExists(text);
  };

  const handleRegister = async () => {
    try {

      const userExists = await checkIfUserExists(email);
      if (userExists) {
        Alert.alert("Error", "An account with this email already exists.");
        return;
      }

      // Create user with email and password
      const userCredential = await createUser(auth, email, password);
      const user = userCredential.user;
      // Add user data to Firestore
      await setDoc(doc(firestore, "RescueTeamData", user.uid), {
        TeamName: teamName,
        NoOfMembers: numMem,
        Address: address,
        ContactName: contactName,
        ContactNumber: phoneNumber,
        EmailID: email,
        Password: password, 
        location,   
        Role:role
      });
      console.log('User registered and data submitted successfully');
      router.push('./Login');
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setLocationLoading(false);
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
    } catch (error) {
      console.error('Error fetching location: ', error);
      Alert.alert('Could not fetch location. Please try again.');
    }
    setLocationLoading(false);
  };

  const toggleLocationInput = () => {
    setIsManualInput(!isManualInput);
    if (!isManualInput) {
      setLocation(''); // Clear location when switching to manual input
    }
  };


  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <Image source={require('../../assets/images/image10.png')} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>
      <Text style={styles.SignUpText}>Sign Up(Rescue Team)</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Rescue Team Name"
          value={teamName}
          onChangeText={text => setTeamName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="No. of members in Team"
          value={numMem}
          onChangeText={text => setNoOfMembers(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Team Contact Person"
          value={contactName}
          onChangeText={text => setContactName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Contact Number"
          value={phoneNumber}
          onChangeText={text => setContactNumber(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmailID(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        /> 
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#a9a9a9"
        />
        <View style={styles.locationSection}>

  
  <View style={styles.locationToggle}>
    <TouchableOpacity 
      style={[styles.toggleButton, !isManualInput && styles.toggleButtonActive]}
      onPress={() => setIsManualInput(false)}
    >
      <Text style={[styles.toggleButtonText, !isManualInput && styles.toggleButtonTextActive]}>
        Automatic
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.toggleButton, isManualInput && styles.toggleButtonActive]}
      onPress={() => setIsManualInput(true)}
    >
      <Text style={[styles.toggleButtonText, isManualInput && styles.toggleButtonTextActive]}>
        Manual
      </Text>
    </TouchableOpacity>
  </View>

  <TextInput
    style={styles.input}
    value={location}
    onChangeText={text => isManualInput ? setLocation(text) : null}
    editable={isManualInput}
    placeholder={isManualInput ? "Enter as 'Lat: X, Lon: Y'" : "Location will appear here"}
    placeholderTextColor="#a9a9a9"
  />

  {!isManualInput && (
    <TouchableOpacity 
      style={styles.locationButton} 
      onPress={handleGetCurrentLocation} 
      disabled={locationLoading}
    >
      {locationLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.buttonText}>Use My Current Location</Text>
      )}
    </TouchableOpacity>
  )}
</View>
           
      </View>
      <TouchableOpacity
        onPress={handleRegister}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
 

      <Text style={styles.footerText}>Already have an account?</Text>
      <Pressable onPress={() => router.push('./Login')}>
        <Text style={styles.signInText}>Sign In</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    // backgroundColor: 'white', // Light background color
    paddingHorizontal: 25,
  },
  logoImage: {
    width: 320,
    height: 220,
    alignSelf: 'center',
    marginBottom:-10,
  },
  logoText: {
    fontSize: 36,
    fontWeight:'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  SignUpText: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft:20,
    fontWeight:'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff', // Title color
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#A53821', // Primary button color
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white', // Button text color
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginTop: -5,
    textAlign: 'center',
  },
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A53821',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  locationButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#5bc0de',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  locationSection: {
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  locationToggle: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A53821',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  toggleButtonActive: {
    backgroundColor: '#A53821',
  },
  toggleButtonText: {
    color: '#A53821',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#FFF',
  }
});

export default RegisterScreen;