//allow bluetooth Page

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function NetworkErrorScreen() {
  return (
    <View style={styles.containermain}>
    <View style={styles.container}>
      <Text style={styles.networkErrorText}>Uh Oh! Network Not found</Text>
      
      <View style={styles.bluetoothContainer}>
        <Image style={styles.bluetoothIcon} source={require('../../assets/images/Bluetooth.png')} />
        <Text style={styles.bluetoothText}>Bluetooth</Text>
        <Text style={styles.bluetoothSubText}>Allow ResQ to access your Bluetooth?</Text>
        
        <TouchableOpacity style={styles.allowButton}>
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '110%', 
    //height: '100%', 

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
   // padding: 20,
  },
  containermain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: 926,
    overflow: "hidden",
    marginTop: -100,
  },
  networkErrorText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 50,
    textAlign: 'center',
  },
  bluetoothContainer: {
    width: '80%',
    height:'50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },
  bluetoothIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    top:80,
  },
  bluetoothText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    top:100,
  },
  bluetoothSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    top:100,
  },
  allowButton: {
    backgroundColor: '#A52A2A',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 10,
    top:100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  skipButton: {
    borderColor: '#A52A2A',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    top:120
  },
  skipButtonText: {
    color: '#A52A2A',
    fontSize: 16,
  }
});
