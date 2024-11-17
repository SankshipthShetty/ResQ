import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { firestore } from '../../constants/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import IconButton from '../../components/IconButton';
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
  const [requirementstatus, setRequirements] = useState(false);
  const [completed, setCompleted] = useState(false);

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
        completed: false, // Provide a default value for 'completed'
        timestamp: new Date() 
      });
         
      const coordinates = location.match(/Lat:\s*(-?[0-9.-]+),\s*Lon:\s*(-?[0-9.-]+)/);
  if (coordinates) {
    const latitude = parseFloat(coordinates[1]);
    const longitude = parseFloat(coordinates[2]);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
  }

  

    
    if (coordinates) {
      const rescueTeamsSnapshot = await getDocs(collection(firestore, 'RescueTeamData'));
      const rescueTeams = rescueTeamsSnapshot.docs.map(doc => {
        const locationString = doc.data().location;
        if (!locationString || typeof locationString !== 'string') {
          console.error(`Invalid or missing location for rescue team: ${doc.id}`);
          return null;
        }
        const match = locationString.match(/Lat:\s*(-?[0-9.-]+),\s*Lon:\s*(-?[0-9.-]+)/);

        if (!match) {
          console.error(`Invalid location format for rescue team: ${doc.id}`);
          return null;
        }
        const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
       console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        return {
          id: doc.id,
          ...doc.data(),
          name:doc.data().TeamName,
          distance: getDistance(
            parseFloat(coordinates[1]),
            parseFloat(coordinates[2]),
            latitude,
          longitude
          ),
        };
      }).filter(Boolean);

      rescueTeams.sort((a, b) => a.distance - b.distance);
     
  
      
      for (const rescueTeam of rescueTeams) {
        console.log("resque team: ",rescueTeam?.name," distance: ", rescueTeam?.distance);
      }
      // console.log("All Rescue Teams sorted by distance:", rescueTeams[0]?.distance);
      
    }


      Alert.alert(
        "Details uploaded successfully!",
        "",
        [
          {
            text: "OK",
            onPress: () => router.push('./1_HomePage'),
          },
        ]
      );
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setLoading(false);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
          left: 15,
          top: -5,
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
    marginTop: -3,
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