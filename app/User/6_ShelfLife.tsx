//Show requirements posted(AI)

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { firestore } from '@/constants/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [fruitDetails, setFruitDetails] = useState<FruitDetail[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const router = useRouter();
  const { param } = useGlobalSearchParams();

  useEffect(() => {
    
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
        if (location.coords.latitude && location.coords.longitude) {
          fetchWeather(location.coords.latitude, location.coords.longitude);
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

  const fetchWeather = async (latitude: number, longitude: number) => {
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
      setTemperature(hourlyData.temperature);
      setHumidity(hourlyData.humidity);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setErrorMsg('Error fetching weather data');
    }
  };

  const handleRequirementClick = (item: string) => {
    const detailIndex = fruitDetails.findIndex(detail => detail.fruit === item);

    if (detailIndex > -1) {
      setFruitDetails(prevDetails => prevDetails.filter(detail => detail.fruit !== item));
    } else {
      const apiEndpoint = 'https://expiry-food.onrender.com/predict';
      const basePayload = {
        Temp: temperature ?? 0,
        Humidity: humidity ?? 0,
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
            const canDonate = data.predicted_days_until_spoilage > 5; // calculated distance to be put here
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
  //   const detail = fruitDetails.find(detail => detail.fruit === fruit);
  //   if (!detail || !userId) {
  //     Alert.alert('Error', 'Invalid donation details');
  //     return;
  //   }

    
      // Add the donation record to Firestore
      

  //     // Update the requirements collection
  //     const disasterDocRef = doc(firestore, 'DisasterReports', param as string);
  //     const disasterDoc = await getDoc(disasterDocRef);
  //     if (disasterDoc.exists()) {
  //       const disasterData = disasterDoc.data();
  //       const updatedRequirements = (disasterData?.requirements || []).map((req: any) => 
  //         req.type === fruit 
  //           ? { ...req, quantityNeeded: req.quantityNeeded - detail.sliderValue,quantityCollected: req.quantityCollected + detail.sliderValue} 
  //           : req
      
  //       );
  //       await setDoc(disasterDocRef, { ...disasterData, requirements: updatedRequirements });
  //     }

  //     Alert.alert('Success', 'Donation confirmed!');
  //   } catch (error) {
  //     console.error('Error confirming donation:', error);
  //     Alert.alert('Error', 'Failed to confirm donation');
  //   }
  // };
  const selectedFruitDetail = fruitDetails.find(detail => detail.fruit === fruit);
    if (!selectedFruitDetail) return;

    

    Alert.alert(
      'Confirm Donation',
      `Are you sure you want to donate ${selectedFruitDetail.sliderValue} units of ${fruit}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {

              // const donationData = {
              //   requirementName: fruit,
              //   userId: userId,
              //   quantitySent: selectedFruitDetail.sliderValue,
              // };
          
              // const disasterDonorsRef = doc(firestore, 'DisasterReports', param as string, 'DisasterDonors', `${userId}_${fruit}`);
              // await setDoc(disasterDonorsRef, donationData);

              const disasterDonorsRef = doc(firestore, 'DisasterReports', param as string, 'DisasterDonors', `${userId}_${fruit}`);
              const donorDoc = await getDoc(disasterDonorsRef);
              
              if (donorDoc.exists()) {
                await updateDoc(disasterDonorsRef, {
                  quantitySent: donorDoc.data().quantitySent + selectedFruitDetail.sliderValue,
                });
              } else {
                const donationData = {
                  requirementName: fruit,
                  userId: userId,
                  quantitySent: selectedFruitDetail.sliderValue,
                };
                await setDoc(disasterDonorsRef, donationData);
              }

              
              const disasterDocRef = doc(firestore, 'DisasterReports', param as string);
              await updateDoc(disasterDocRef, {
                requirements: requirements.map(req =>
                  req.type === fruit
                    ? {
                        ...req,
                        quantityCollected: req.quantityCollected + selectedFruitDetail.sliderValue,
                        quantityNeeded: req.quantityNeeded - selectedFruitDetail.sliderValue,
                      }
                    : req
                ),
              });


              setDataChanged(true);
              // Redirect to another page (e.g., a thank you page)
              router.replace('./1_HomePage');
            } catch (error) {
              console.error('Error updating document:', error);
              Alert.alert('Error', 'An error occurred while updating the donation.');
            }
          },
        },
      ]
    );
  };


  let text = 'Fetching location...';
  if (errorMsg) { 
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.paragraph}>Temperature: {temperature}°C</Text>
      <Text style={styles.paragraph}>Humidity: {humidity}%</Text>
      <Text style={styles.heading}>Select a Fruit:</Text>
      <View style={styles.requirementsContainer}>
        {requirements.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              fruitDetails.find(detail => detail.fruit === item.type) ? styles.buttonSelected : null,
            ]}
            onPress={() => handleRequirementClick(item.type)}
          >
            <Text style={styles.buttonText}>{item.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {fruitDetails.length > 0 && (
        <View style={styles.detailsContainer}>
          {fruitDetails.map((detail, index) => (
            <View key={index} style={styles.detail}>
              <Text style={styles.detailHeading}>{detail.fruit}</Text>
              <Text style={styles.paragraph}>Days until spoilage: {detail.predictedDays}</Text>
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
    color: '#fff',
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
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});
