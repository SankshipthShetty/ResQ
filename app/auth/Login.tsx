//user loginn redirection page 
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image , Pressable,Alert} from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../../constants/firebaseConfig';
import {useRouter} from 'expo-router';

import logo from '../../assets/images/image1.png';
import { doc, getDoc } from 'firebase/firestore';


const LoginScreen = ({ navigation }: any) => {
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      
      // Retrieve user data from Firestore using uid
      const userDoc = await getDoc(doc(firestore, 'UserData', user.uid));
      const userDocMB = await getDoc(doc(firestore, 'MiddleBodyData', user.uid));
      const userDocRT = await getDoc(doc(firestore, 'RescueTeamData', user.uid));
    
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the role field exists in the user data
        if (userData && userData.Role) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('FirstName', userData.FirstName);
          await AsyncStorage.setItem('LastName', userData.LastName);
          navigateToRoleBasedScreen(userData.Role);
        } else {
          setError('User role not found.');
        }
      }
      else if (userDocRT.exists()) {
        const userData = userDocRT.data();

        // Check if the role field exists in the user data
        if (userData && userData.Role) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('FirstName', userData.TeamName);
          navigateToRoleBasedScreen(userData.Role);
        } else {
          setError('User role not found.');
        }
      }
      else if (userDocMB.exists()) {
        const userData = userDocMB.data();

        // Check if the role field exists in the user data
        if (userData && userData.Role) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('FirstName', userData.FirstName);
          await AsyncStorage.setItem('LastName', userData.LastName);
          navigateToRoleBasedScreen(userData.Role);
        } else {
          setError('User role not found.');
        }
      }
      else {
        setError('User data not found in Firestore.');
      }
    } catch (err) {
      Alert.alert('Uh-oh!', "Invalid email or password. \n\nPlease try again.")
    }
  };


  const navigateToRoleBasedScreen = (Role: string) => {
    switch (Role) {
      case 'User':
        router.push('../User/Userpage1');
        break;
      case 'RescueTeam':
        router.push('../RescueTeams/RT1');
        break;
      case 'MiddleBody':
        router.push('../User/Userpage1');
        break;
      default:
        setError('Invalid role.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>
      <Text style={styles.loginText}>Login</Text>
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

      <TouchableOpacity>
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
        <Pressable onPress={() => router.push('./MainSignup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </Pressable>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -25,
    justifyContent: 'center',
    padding: 16,
    // backgroundColor: '#fff',
  },
  logoImage: {
    width: 400,
    height: 250,
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
