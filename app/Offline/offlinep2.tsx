import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NetworkErrorScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.networkErrorText}>Offline Connection!!</Text>
      
      <View style={styles.bluetoothContainer}>
        <Image style={styles.bluetoothIcon} source={require('../../assets/images/Bluetooth.png')} />

        <Text style={styles.bluetoothSubText}>Allow ResQ to access your Bluetooth and Wifi?</Text>
        
        <TouchableOpacity style={styles.allowButton} onPress={() => router.push("./offlinep4")}>
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => router.push("./Offlinep1")}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  networkErrorText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 50,
    textAlign: 'center',
  },
  bluetoothContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },
  bluetoothIcon: {
    width: 180,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  bluetoothSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  allowButton: {
    backgroundColor: '#A52A2A',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    borderColor: '#A52A2A',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  skipButtonText: {
    color: '#A52A2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
