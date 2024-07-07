// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
// import * as Location from 'expo-location';
// import Slider from '@react-native-community/slider';
// import axios from 'axios';
// import remove from '../../assets/images/remove.png';
// import check from '../../assets/images/check.png';

// export default function App() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [temperature, setTemperature] = useState(null);
//   const [humidity, setHumidity] = useState(null);

//   useEffect(() => {
//     const getLocation = async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }
//       try {
//         const location = await Location.getCurrentPositionAsync({});
//         setLocation(location);
//         fetchWeather(location.coords.latitude, location.coords.longitude);
//       } catch (error) {
//         setErrorMsg('Error fetching location');
//         console.error(error);
//       }
//     };
//     getLocation();
//   }, []);

//   const fetchWeather = async (latitude, longitude) => {
//     const options = {
//       method: 'GET',
//       url: 'https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast',
//       params: {
//         location: `${latitude},${longitude}`,
//         timesteps: '1h',
//         units: 'metric',
//       },
//       headers: {
//         'x-rapidapi-key': '4d86c6faaemshcecb8787a078cd8p18f5bajsn7133309cd12f',
//         'x-rapidapi-host': 'tomorrow-io1.p.rapidapi.com',
//       },
//     };
//     try {
//       const response = await axios.request(options);
//       console.log('Temp data:', response.data.timelines.hourly[0].values.temperature);
//       console.log('humidity data:', response.data.timelines.hourly[0].values.humidity);
//       const hourlyData = response.data.timelines.hourly[0].values;
//       setTemperature(hourlyData.temperature);
//       setHumidity(hourlyData.humidity);
//     } catch (error) {
//       console.error('Error fetching weather:', error);
//       setErrorMsg('Error fetching weather data');
//     }
//   };

//   let text = 'Fetching location...';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
//   }

//   interface FruitDetail {
//     fruit: string;
//     predictedDays: number;
//     donationMessage: string;
//     canDonate: boolean;
//     sliderValue: number;
//   }

//   const [fruitDetails, setFruitDetails] = useState<FruitDetail[]>([]);
//   const requirements = ['Apple', 'Banana', 'Grapes', 'Jackfruit', 'Lemon', 'Litchi', 'Mango', 'Papaya'];

//   const fruitPayloads = {
//     Apple: { Fruit_Apple: true, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Banana: { Fruit_Apple: true, Fruit_Banana: true, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Grapes: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: true, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Jackfruit: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: true, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Lemon: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: true, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Litchi: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: true, Fruit_Mango: false, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Mango: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: true, Fruit_Papaya: false, Fruit_Plum: false, Fruit_Tomato: false },
//     Papaya: { Fruit_Apple: false, Fruit_Banana: false, Fruit_Grapes: false, Fruit_Jackfruit: false, Fruit_Lemon: false, Fruit_Litchi: false, Fruit_Mango: false, Fruit_Papaya: true, Fruit_Plum: false, Fruit_Tomato: false },
//   };

//   const handleRequirementClick = (item) => {
//     const detailIndex = fruitDetails.findIndex(detail => detail.fruit === item);

//     if (detailIndex > -1) {
//       setFruitDetails(prevDetails => prevDetails.filter(detail => detail.fruit !== item));
//     } else {
//       const apiEndpoint = 'https://expiry-food.onrender.com/predict';
//       const basePayload = {
//         Temp: temperature,
//         Humidity: humidity,
//         CO2: 300,// shd fetch from co2 api here
//       };
//       const fruitPayload = fruitPayloads[item];
//       const data = { ...basePayload, ...fruitPayload };

//       fetch(apiEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })
//         .then(response => response.json())
//         .then(data => {
//           const canDonate = data.predicted_days_until_spoilage > 5;//calculated distance to be put here
//           setFruitDetails(prevDetails => [
//             ...prevDetails,
//             {
//               fruit: item,
//               predictedDays: Math.round(data.predicted_days_until_spoilage),
//               donationMessage: canDonate
//                 ? `You are allowed to donate this item. `
//                 : 'You are not allowed to donate this item. ',
//               canDonate, 
//               sliderValue: 0, 
//             },
//           ]);
//         })
//         .catch(error => {
//           Alert.alert('Error', 'Something went wrong!');
//           console.error('Error:', error);
//         });
//     }
//   };

//   const handleSliderChange = (value, fruit) => {
//     setFruitDetails(prevDetails => prevDetails.map(detail => 
//       detail.fruit === fruit ? { ...detail, sliderValue: value } : detail
//     ));
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//       {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>{text}</Text>
//         {temperature !== null && <Text>Temperature: {temperature}°C</Text>}
//         {humidity !== null && <Text>Humidity: {humidity}%</Text>}
//       </View> */}
//       <View style={styles.container}>
//         <Text style={styles.header}>Requirements</Text>
//         <View style={styles.requirementsContainer}>
//           {requirements.map((item, index) => {
//             const detail = fruitDetails.find(detail => detail.fruit === item);
//             const backgroundColor = detail ? (detail.canDonate ? '#66ee20' : '#f70925') : '#f7f0ee';
//             return (
//               <TouchableOpacity
//                 key={index}
//                 style={[styles.requirementItem, styles.button, { backgroundColor }]}
//                 onPress={() => handleRequirementClick(item)}
//               >
//                 <Text style={styles.requirementText}>{item}</Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         <View style={styles.donationContainer}>
//           {fruitDetails.map((detail, index) => (
//             <View key={index} style={styles.donationItem}>
//               <View style={styles.donationHeader}>
//                 <Text style={styles.itemTitle}>{detail.fruit}</Text>
               
//               </View>
//               <Text>{detail.donationMessage} {detail.canDonate ? <Image source={check} style={styles.image} /> : <Image source={remove} style={styles.image} />}</Text>
//               {detail.canDonate ? (
//                  <View >
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={30}
//                 step={1}
//                 value={detail.sliderValue}
//                 thumbTintColor="#10f709" 
//                 minimumTrackTintColor="#10f709"
//                 onValueChange={(value) => handleSliderChange(value, detail.fruit)}
//               />
        
//               <Text>Selected quantity: {detail.sliderValue} L</Text>
              
//                 <TouchableOpacity style={styles.confirmButton}>
//                   <Text style={styles.buttonText}>Confirm</Text>
//                 </TouchableOpacity>
//                 </View>
//               ):null}
              
//               {/* <Text>Predicted days until spoilage: {detail.predictedDays}</Text> */}
//             </View>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   requirementsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   requirementItem: {
//     padding: 10,
//     margin: 5,
//     borderRadius: 20,
//     backgroundColor: '#d3d3d3',
//     borderWidth: 1,
//     borderColor: '#a9a9a9',
//   },
//   button: {
//     backgroundColor: '#f3f3f3',
//     borderColor: '#a9a9a9',
//     borderWidth: 1,
//     borderRadius: 20,
//     padding: 12,
//     margin: 5,
//   },
//   requirementText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   donationContainer: {
//     width: '100%',
//   },

//   donationItem: {
//     marginBottom: 20,
//     padding: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   donationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   itemTitle: {
//     fontSize: 18,
//     paddingBottom:7,
//     fontWeight: 'bold',
//   },
//   image: {
//     width: 15,
//     height: 15,
//   },
//   confirmButton: {
//     backgroundColor: 'orange',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//     marginBottom: 5
//   },
// });
