//Show requirements posted(AI)

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { firestore } from '@/constants/firebaseConfig';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';


interface Requirement {
  type: string;
  quantityNeeded: number;
  quantityCollected: number;
}

interface FruitDetail {
  fruit: string;
  predictedDays: number;
  donationMessage: string; 
  canDonate: boolean;
  sliderValue: number;
  quantityNeeded: number;
  // quantityCollected: number;
}




const fruitPayloads: Record<string, object> = {
  Apple: { Fruit_Apple: true, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Banana: { Fruit_Apple: true, Fruit_Banana: true, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Grapes: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: true, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Jackfruit: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: true, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Lemon: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: true, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Litchi: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: true, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Mango: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: true, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
  Papaya: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: true, Fruit_Plum: false, Fruit_Tomato: false },
};

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [dis_temperature,dis_setTemperature] = useState<number | null>(null);
  const [dis_humidity, dis_setHumidity] = useState<number | null>(null);
  const [averageTemp, setAverageTemp] = useState<number | null>(null);
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);
  const [fruitDetails, setFruitDetails] = useState<FruitDetail[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [tempFetched, setTempFetched] = useState({ current: false, disaster: false });
  const router = useRouter();
  const { param ,lat,lon} = useGlobalSearchParams();
 
  const [travelTime, setTravelTime] = useState<string | null>(null);

  useEffect(() => {
    if (param && lat && lon) {
      // You can now use param, lat, and lon in your component

      console.log(`disaster Latitude: ${lat}`);
      console.log(`disaster Longitude: ${lon}`);
    }


    const getLocation = async () => {
      const userstate=await AsyncStorage.getItem('UserId');
      setUserId(userstate);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        if (location.coords.latitude && location.coords.longitude && lat && lon) {
          const travelTime = await fetchRouteDirections(location.coords.latitude, location.coords.longitude, lat, lon);
          setTravelTime(travelTime);
          fetchWeather(location.coords.latitude, location.coords.longitude,'current');
          fetchWeather(Number(lat), Number(lon), 'disaster');
        }
      } catch (error) {
        setErrorMsg('Error fetching location');
        console.error(error);
      }
    };
    getLocation();
 
    // Fetch the requirements from Firestore
    const fetchRequirements = async () => {
      const disasterDocRef = doc(firestore, 'DisasterReports', param as string);
      try {

        const disasterDoc = await getDoc(disasterDocRef);
        if (disasterDoc.exists()) {
          const disasterData = disasterDoc.data();
          const fetchedRequirements = disasterData?.requirements || [];
          const normalizedRequirements = fetchedRequirements.map((req: any) => ({
            ...req,
            quantityNeeded: Number(req.quantityNeeded) || 0, // Ensure quantityNeeded is a number
          }));
          setRequirements(normalizedRequirements);
         
        }
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    };
   
    fetchRequirements();
  }, []);


  const fetchRouteDirections = async (sourceLat: number, sourceLon: number, destLat: number, destLon: number) => {
    const apiKey = 'GBbSOvkTtCg7bF3sUzKJFsM0okvNfxAj4B0xPcLcyXGNqO1qNVguJQQJ99AGACYeBjFPDDZUAAAgAZMPw3AT';
    const apiUrl = `https://atlas.microsoft.com/route/directions/json`;
  
    const params = {
      'subscription-key': apiKey,
      'api-version': '1.0',
      query: `${sourceLat},${sourceLon}:${destLat},${destLon}`,
      travelMode: 'truck',
      traffic: 'true',
      departAt: '2025-03-29T08:00:20',
      computeTravelTimeFor: 'all',
    };
  
    try {
      const response = await axios.get(apiUrl, { params });
      if (response.data.routes && response.data.routes.length > 0) {
        const travelTimeInSeconds = response.data.routes[0].summary.travelTimeInSeconds;
        const travelTimeInHours = travelTimeInSeconds / 3600
        const travelTimeIndays = Math.round(travelTimeInHours / 10).toFixed(0);
        return travelTimeIndays;
      } else {
        throw new Error('No route found');
      }
      // return response;
    } catch (error:any) {
      console.error('Error fetching route directions:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  

  const fetchWeather = async (latitude: number, longitude: number,locationType: 'current' | 'disaster') => {
    const options = {
      method: 'GET',
      url: 'https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast',
      params: {
        location: `${latitude},${longitude}`,
        timesteps: '1h',
        units: 'metric',
      },
      headers: {
        'x-rapidapi-key': '4d86c6faaemshcecb8787a078cd8p18f5bajsn7133309cd12f',
        'x-rapidapi-host': 'tomorrow-io1.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      const hourlyData = response.data.timelines.hourly[0].values;
      const temp = hourlyData.temperature;
      const hum = hourlyData.humidity;
      if (locationType === 'current') {
        setTemperature(temp);
        setHumidity(hum);
        setTempFetched(prev => ({ ...prev, current: true }));
      } else if (locationType === 'disaster') {
        dis_setTemperature(temp);
        dis_setHumidity(hum);
        setTempFetched(prev => ({ ...prev, disaster: true }));
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setErrorMsg('Error fetching weather data');
    }
  };

  useEffect(() => {
    if (tempFetched.current && tempFetched.disaster) {
      const avgTemp = ((temperature + dis_temperature) / 2).toFixed(0);
      const avgHumidity = ((humidity + dis_humidity) / 2).toFixed(0);
  
      setAverageTemp(Number(avgTemp));
      setAverageHumidity(Number(avgHumidity));
    }
  }, [tempFetched, temperature, dis_temperature, humidity, dis_humidity]);
  

  const handleRequirementClick = (item: string) => {
    const detailIndex = fruitDetails.findIndex(detail => detail.fruit === item);

    if (detailIndex > -1) {
      setFruitDetails(prevDetails => prevDetails.filter(detail => detail.fruit !== item));
    } else {
      const apiEndpoint = 'https://expiry-food.onrender.com/predict';
      const basePayload = {
        Temp: averageTemp ?? 0,
        Humidity: averageHumidity ?? 0,
        CO2: 300, // should fetch from CO2 API here
      };
      const fruitPayload = fruitPayloads[item] || {};
      const data = { ...basePayload, ...fruitPayload };

      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.text()) // Get response as text
        .then(responseText => {
          try {
            const data = JSON.parse(responseText); // Try parsing the text to JSON
            const canDonate = travelTime !== null && data.predicted_days_until_spoilage > travelTime; // calculated distance to be put here
            const requirement = requirements.find(req => req.type === item);
            const quantityNeeded = requirement ? requirement.quantityNeeded : 0;
            setFruitDetails(prevDetails => [
              ...prevDetails,
              {
                fruit: item,
                predictedDays: Math.round(data.predicted_days_until_spoilage),
                donationMessage: canDonate
                  ? `You are allowed to donate this item. `
                  : 'You are not allowed to donate this item. ',
                canDonate,
                sliderValue: 0,
                quantityNeeded,
              },
            ]);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            Alert.alert('Error', 'Invalid response from the server');
          }
        })
        .catch(error => {
          Alert.alert('Error', 'Something went wrong!');
          console.error('Error:', error);
        });
    }
  };

  const handleSliderChange = (value: number, fruit: string) => {
    setFruitDetails(prevDetails => prevDetails.map(detail =>
      detail.fruit === fruit ? { ...detail, sliderValue: value } : detail
    ));
  };

  
  const handleDonationConfirm = async (fruit: string) => {
    const selectedFruitDetail = fruitDetails.find(detail => detail.fruit === fruit);
    if (!selectedFruitDetail || !userId) {
      Alert.alert('Error', 'Invalid donation details');
      return;
    }
  
    // Fetch user data
    const userDocRef = doc(firestore, 'UserData', userId);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      Alert.alert('Error', 'User data not found');
      return;
    }
  
    const userData = userDoc.data();
    const donorInfo = {
      userfname: userData.FirstName || 'Unknown',
      userlname: userData.LastName || ' ',
      userId: userId,
      phoneNumber: userData.PhoneNumber || 'N/A',
      email: userData.Email || 'N/A',
      quantityDonated: selectedFruitDetail.sliderValue,
      donationDate: new Date()
    };
  
    Alert.alert(
      'Confirm Donation',
      `Are you sure you want to donate ${selectedFruitDetail.sliderValue} units of ${fruit}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Update DisasterReports document
              const disasterDocRef = doc(firestore, 'DisasterReports', param as string);
              const disasterDoc = await getDoc(disasterDocRef);
  
              if (!disasterDoc.exists()) {
                Alert.alert('Error', 'Disaster report not found');
                return;
              }
  
              const disasterData = disasterDoc.data();
              const updatedRequirements = (disasterData?.requirements || []).map((req: any) =>
                req.type === fruit
                  ? {
                      ...req,
                      quantityCollected: req.quantityCollected + selectedFruitDetail.sliderValue,
                      quantityNeeded: req.quantityNeeded - selectedFruitDetail.sliderValue,
                    }
                  : req
              );
              await updateDoc(disasterDocRef, { requirements: updatedRequirements });
  
              // Update DisasterDonors subcollection
              const donorDocRef = doc(firestore, 'DisasterReports', param as string, 'DisasterDonors', fruit);
              const donorDoc = await getDoc(donorDocRef);
  
              if (donorDoc.exists()) {
                const donorData = donorDoc.data();
                const existingQuantity = donorData?.TotalQuantityCollected || 0;
                const existingDonors = donorData?.Donors || [];
  
                // Check if the user is already in the Donors list
                const existingDonorIndex = existingDonors.findIndex((donor: any) => donor.userId === userId);
                if (existingDonorIndex > -1) {
                  // Update existing donor
                  existingDonors[existingDonorIndex] = {
                    ...existingDonors[existingDonorIndex],
                    quantityDonated: existingDonors[existingDonorIndex].quantityDonated + selectedFruitDetail.sliderValue,
                    donationDate: moment().format('YYYY-MM-DD hh:mm:ss A')
                  };
                } else {
                  // Add new donor
                  existingDonors.push(donorInfo);
                }
  
                await updateDoc(donorDocRef, {
                  TotalQuantityCollected: existingQuantity + selectedFruitDetail.sliderValue,
                  QuantityNeeded: (donorData?.QuantityNeeded || 0) - selectedFruitDetail.sliderValue,
                  Donors: existingDonors,
                });
              } else {
                // Create a new DisasterDonors document
                await setDoc(donorDocRef, {
                  TotalQuantityCollected: selectedFruitDetail.sliderValue,
                  QuantityNeeded: requirements.find(req => req.type === fruit)?.quantityNeeded || 0,
                  Donors: [donorInfo],
                });
              }
  
              setDataChanged(true);
              router.replace('./1_HomePage');
            } catch (error) {
              console.error('Error confirming donation:', error);
              Alert.alert('Error', 'Failed to confirm donation');
            }
          },
        },
      ]
    );
  };
  


  let text = 'Fetching location...';
  let cur_lat ;
  let cur_lon ;
  if (errorMsg) { 
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
     cur_lat = location.coords.latitude;
     cur_lon = location.coords.longitude;
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* <View >
      <Text>Latitude: {lat}</Text>
      <Text>Longitude: {lon}</Text>
      <Text>humidity: {dis_humidity}</Text>
      <Text>temp: {dis_temperature}</Text>
      {travelTime && (
        <Text>Travel Time to Disaster Location: {travelTime} days</Text>
      )}
    </View>
 
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.paragraph}>Temperature: {temperature}°C</Text>
      <Text style={styles.paragraph}>Humidity: {humidity}%</Text>
      <Text style={styles.paragraph}>av_temp: {averageTemp}%</Text>
      <Text style={styles.paragraph}>av_hum: {averageHumidity}%</Text> */}
     
      <Text style={styles.heading}>Select a Fruit:</Text>
      <View style={styles.requirementsContainer}>
        {requirements.map((item, index) => {
           const detail = fruitDetails.find(detail => detail.fruit === item.type);
           const backgroundColor = detail ? (detail.canDonate ? '#66ee20' : '#f70925') : '#f7f0ee';
          
          return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              styles.requirementItem, 
              { backgroundColor }
            ]}
            onPress={() => handleRequirementClick(item.type)}
          >
            <Text style={styles.buttonText}>{item.type}</Text>
          </TouchableOpacity>
          );
})}
      </View>
      {fruitDetails.length > 0 && (
        <View style={styles.detailsContainer}>
          {fruitDetails.map((detail, index) => (
            <View key={index} style={styles.detail}>
              <Text style={styles.detailHeading}>{detail.fruit}</Text>
              <Text style={styles.paragraph}>Days until spoilage: {detail.predictedDays}</Text>
              {travelTime && (
        <Text>Travel Time to Disaster Location: {travelTime} days</Text>
      )}
              <Text style={styles.paragraph}>{detail.donationMessage}</Text>
              {detail.canDonate && (
                <>
                  <Text style={styles.sliderLabel}>Quantity to donate:</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={detail.quantityNeeded}
                    step={1}
                    value={detail.sliderValue}
                    thumbTintColor="#10f709"
                    minimumTrackTintColor="#10f709"
                    onValueChange={(value) => handleSliderChange(value, detail.fruit)}
                  />
                  <Text style={styles.sliderValue}>Selected quantity: {detail.sliderValue}</Text>
                  <TouchableOpacity
                    style={styles.donateButton}
                    onPress={() => handleDonationConfirm(detail.fruit)}
                  >
                    <Text style={styles.buttonText}>Confirm Donation</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
     marginBottom: 20
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
  buttonSelected: {
    backgroundColor: '#32CD32',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 30,
    width: '100%',
  },
  detail: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  detailHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 10,
  },
  donateButton: {
    backgroundColor: 'orange',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  requirementItem: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    borderWidth: 1,
    borderColor: '#a9a9a9',
  }
});