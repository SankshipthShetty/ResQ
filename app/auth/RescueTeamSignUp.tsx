import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert ,Image,Pressable} from 'react-native';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, firestore, createUser } from '../../constants/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useRouter} from 'expo-router';
import debounce from 'lodash.debounce';


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
        Role:role
      });
      console.log('User registered and data submitted successfully');
      router.push('./Login');
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error", error.message);
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
});

export default RegisterScreen;