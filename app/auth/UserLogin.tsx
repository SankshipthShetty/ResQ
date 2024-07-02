//user loginn redirection page 


import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image , Pressable} from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../constants/firebaseConfig';
import {useRouter} from 'expo-router';

import logo from '../../assets/images/image1.png';


const LoginScreen = ({ navigation }: any) => {
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const setData=async()=>
    { 
     await AsyncStorage.setItem("data","Sankshipth")
    }
    const getData=async()=>{
      const name=await AsyncStorage.getItem("data");
      console.warn(name);
    }
    const removedata=async()=>{
      await AsyncStorage.removeItem("data");
    }
  
 

  const handleLogin = async () => {
    try {
      const userCred=await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred)
      
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>
      <Text style={styles.loginText}>User Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#a9a9a9"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#a9a9a9"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
      </TouchableOpacity>
      {/* <Button title="Set Data" onPress={setData} />
      <Button title="Get Data" onPress={getData} /> */}
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../../assets/images/google.png')} style={styles.googleLogo} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
     
      <View style={styles.signupTextContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <Pressable onPress={() => router.push('./UserSignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </Pressable>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -15,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 350,
    height: 200,
    alignSelf: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  loginText: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft:20,
    fontWeight:'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  forgotPasswordText: {
    textAlign: 'right',
    paddingRight: 20,
    color: '#A53821',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#A53821',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 10,
   
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: '90%', 
    alignSelf: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  signupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    //make this text in next line
    alignItems: 'center',
    color: '#000',
  },
  signupLink: {
    color: '#A53821',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
