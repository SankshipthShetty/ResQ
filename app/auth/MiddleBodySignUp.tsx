//middle body signin info 


import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Pressable } from 'react-native';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, firestore, createUser } from '../../constants/firebaseConfig'; // Provide the correct file path
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [typeOfOrganization, setTypeOfOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [role,setRole]=useState('MiddleBody');
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
    setEmail(text);
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
      await setDoc(doc(firestore, "MiddleBodyData", user.uid), {
        Address: address,
        "Email Id": email,
        "Organization Name": organizationName,
        "Phone Number": phoneNumber,
        "Type of Organization": typeOfOrganization,
        password: password,
        Role:role
      });
      console.log('Data submitted successfully');
      
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
      <Image source={require('../../assets/images/image2.png')} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>
      <Text style={styles.SignUpText}>MiddleBody Sign Up</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Email Id"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Organization Name"
          value={organizationName}
          onChangeText={text => setOrganizationName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Type of Organization"
          value={typeOfOrganization}
          onChangeText={text => setTypeOfOrganization(text)}
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
        <Text style={styles.buttonText} onPress={() => router.push('./Login')}>Register</Text>
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
    // backgroundColor: 'white',
    paddingHorizontal: 20,
    
  },
  logoImage: {
    width: 350,
    height: 220,
    alignSelf: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  SignUpText: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    backgroundColor: '#A53821',
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
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