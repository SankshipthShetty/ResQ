import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { firestore } from '../../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import IconButton from '@/components/IconButton';
import * as Location from 'expo-location';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

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
  const [requirementstatus, setRequirements] = useState(false);

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
        requirementstatus,
        timestamp: new Date()
      });
      Alert.alert(
        "Details uploaded successfully!",
        "",
        [
          {
            text: "OK",
            onPress: () => router.push('./0_HomePage'),
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
          paddingTop: height * 0.05,
          left: width * 0.02,
          top: -height * 0.03,
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
    padding: width * 0.05,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    color: 'brown',
  },
  title: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'left', // Align title to the left
    width: '100%', // Ensure it takes full width of container
    color: 'grey',
  },
  image: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.04,
  },
  button: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#D9534F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: height * 0.03,
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  locationButton: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#5bc0de',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
});
