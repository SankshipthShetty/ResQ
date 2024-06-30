//user signup page 

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert ,Image,Pressable} from 'react-native';
import { addDoc, collection } from "firebase/firestore";
import { auth, firestore, createUser } from '../../constants/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useRouter} from 'expo-router';

import logo from '../../assets/images/image19.png';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [cityTownVillage, setCityTownVillage] = useState('');
  const [district, setDistrict] = useState('');

  const handleRegister = async () => {
    try {
      // Add user data to Firestore
      await addDoc(collection(firestore, "UserData"), {
        Email: email,
        PhoneNumber: phoneNumber,
        FirstName: firstName,
        LastName: lastName,
        Password: password,
        Pincode: pincode,
        State: state,
        Street: street,
        CityTownVillage: cityTownVillage,
        District: district
      });
      console.log('Data submitted successfully');
      
      // Create user with email and password
      await createUser(auth, email, password);
    } catch (error:any) {
      console.log(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handleLogin = () => {
    router.push('login');
  };


  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <Image source={require('../../assets/images/image19.png')} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>
      <Text style={styles.SignUpText}>User Sign Up</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={text => setFirstName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={text => setLastName(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
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
          placeholder="City/Town/Village"
          value={cityTownVillage}
          onChangeText={text => setCityTownVillage(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="District"
          value={district}
          onChangeText={text => setDistrict(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={text => setState(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Street"
          value={street}
          onChangeText={text => setStreet(text)}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
        />
        <TextInput
          placeholder="Pincode"
          value={pincode}
          onChangeText={text => setPincode(text)}
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
        <Text style={styles.buttonText} >Register</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Already have an account?</Text>
      <Pressable onPress={() => router.push('./MainLogin')}>
        <Text style={styles.signInText}>Sign In</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white', // Light background color
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 250,
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