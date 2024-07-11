import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { firestore } from '../../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import IconButton from '@/components/IconButton';
import * as Location from 'expo-location';

export default function Userpage4() {
  const params = useLocalSearchParams();
  const imageUrl = Array.isArray(params.imageUrl) ? params.imageUrl[0] : params.imageUrl;
  const decodedImageUrl = imageUrl ? atob(imageUrl) : null; // Decode the URL using Base64

  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [onduty, setOnduty] = useState('None');
  const [requirements, setRequirements] = useState('Not uploaded');

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'DisasterReports'), {
        name,
        locationName,
        location,
        phoneNumber,
        imageUrl: decodedImageUrl,
        onduty,
        requirements,
        timestamp: new Date() 
      });
      Alert.alert(
        "Details uploaded successfully!",
        "",
        [
          {
            text: "OK",
            onPress: () => router.push('./Userpage1'),
          },
        ]
      );
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setLoading(false);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
          top: -30,
        }}
      >
        <IconButton
          onPress={() => router.back()} // This will navigate back to the previous screen
          iosName={"arrow.left.circle"}
          androidName="arrow-back"
        />
      </View>

      <Text style={styles.heading}>Reporting</Text>
      <Text style={styles.title}>Your Image:</Text>
      {decodedImageUrl ? (
        <Image
          source={{ uri: decodedImageUrl }}
          style={styles.image}
        />
      ) : (
        <Text>No image available</Text>
      )}
      <Text style={styles.title}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Text style={styles.title}>Location Name</Text>
      <TextInput
        style={styles.input}
        value={locationName}
        onChangeText={setLocationName}
      />
      <Text style={styles.title}>Location (Latitude, Longitude)</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        editable={false} // Make the TextInput read-only
      />
      <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation} disabled={locationLoading}>
        {locationLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Use My Current Location</Text>}
      </TouchableOpacity>
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Upload</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: 'brown',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'left', // Align title to the left
    width: '100%', // Ensure it takes full width of container
    color: 'grey',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#D9534F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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
});