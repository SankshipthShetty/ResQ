import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
  } from "react-native";
  import { Picker } from "@react-native-picker/picker";
  import React, { useEffect, useState } from "react";
  import { router } from "expo-router";
  import { signOut } from "firebase/auth";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { auth, firestore } from "@/constants/firebaseConfig"; // Ensure you import firestore here
  import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
  
  // Define the Requirement type
  type Requirement = {
    type: string;
    quantityNeeded: string;
    quantityCollected: string;
  };
  
  export default function App() {
    const [fname, setfName] = useState('');
    const [numCamps, setNumCamps] = useState<string>('');
    const [campCounts, setCampCounts] = useState<string[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [newRequirement, setNewRequirement] = useState<Requirement>({ type: '', quantityNeeded: '', quantityCollected: '' });
  
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        await AsyncStorage.removeItem('isLoggedIn');
        router.replace('../auth/Login'); // Adjust the path to your login page
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    };
  
    const handleAddRequirement = () => {
      setRequirements([...requirements, newRequirement]);
      setNewRequirement({ type: '', quantityNeeded: '', quantityCollected: '' });
    };
  
    const handleSaveRequirements = async () => {
      // const disasterId = "some-id"; // Use the actual disaster ID
      const disasterDocRef = doc(firestore, "DisasterReports",  'ACmOXu42pBGVwDPzWP6g' );
      try {
        for (let requirement of requirements) {
          await updateDoc(disasterDocRef, {
            requirements: arrayUnion(requirement)
          });
        }
        console.log("Requirements added successfully!");
      } catch (error) {
        console.error("Error adding requirements: ", error);
      }
    };
  
    const handleNumCampsChange = (value: string) => {
      setNumCamps(value);
      if (value === '') {
        setCampCounts([]);
      } else {
        const numCampsInt = parseInt(value, 10);
        const newCampCounts = Array(numCampsInt).fill('');
        setCampCounts(newCampCounts);
      }
    };
  
    const handleCampCountChange = (index: number, value: string) => {
      const newCampCounts = [...campCounts];
      newCampCounts[index] = value;
      setCampCounts(newCampCounts);
    };
  
    useEffect(() => {
      const fetchName = async () => {
        const fname = await AsyncStorage.getItem("FirstName");
        if (fname) {
          setfName(fname);
        }
      };
  
      fetchName();
    }, []);
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Rescue Team Details</Text>
            <TouchableOpacity onPress={() => router.push("../../ProfilePageEdit/RescueProf")} style={styles.profileButton}>
              <Image
                source={require('../../assets/images/profilepic.png')} // Adjust the path to your image
                style={styles.headerImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Hi, {fname} 👋</Text>
        </View>
        <Text style={styles.heading}>Select the requirements needed</Text>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Number of Camps"
            value={numCamps}
            onChangeText={handleNumCampsChange}
            style={styles.input}
            keyboardType="numeric"
          />
          {campCounts.map((count, index) => (
            <TextInput
              key={index}
              placeholder={`Number of people in camp ${index + 1}`}
              value={count}
              onChangeText={(value) => handleCampCountChange(index, value)}
              style={styles.input}
              keyboardType="numeric"
            />
          ))}
          <Picker
            selectedValue={newRequirement.type}
            onValueChange={(itemValue) =>
              setNewRequirement({ ...newRequirement, type: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Select Requirement" value="" />
            <Picker.Item label="Apple" value="Apple" />
            <Picker.Item label="Banana" value="Banana" />
            <Picker.Item label="Grapes" value="Grapes" />
            <Picker.Item label="Jackfruit" value="Jackfruit" />
            <Picker.Item label="Lemon" value="Lemon" />
            <Picker.Item label="Grapes" value="Grapes" />
            <Picker.Item label="Litchi" value="Litchi" />
            <Picker.Item label="Mango" value="Mango" />
            <Picker.Item label="Papaya" value="Papaya" />
            
          {/* Add more items as needed */}
          </Picker>
          <TextInput
            placeholder="Enter Quantity"
            value={newRequirement.quantityNeeded}
            onChangeText={(text) =>
              setNewRequirement({ ...newRequirement, quantityNeeded: text })
            }
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TouchableOpacity onPress={handleAddRequirement} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Add Requirements</Text>
          </TouchableOpacity>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text>{req.type}: {req.quantityNeeded} KG/L</Text>
            </View>
          ))}
          <TouchableOpacity onPress={handleSaveRequirements} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.resq}>ResQ</Text>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#f7f7f7",
      padding: 20,
    },
    textContainer: {
      width: '100%',
      textAlign: "left",
      marginBottom: 20,
    },
    text: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "left",
      color: "#333",
    },
    heading:{
  fontSize: 20,
  marginTop:10,
  marginBottom: 20,
  textAlign: "center",
  fontWeight: "bold",
    },
    resq: {
      marginTop: 20,
      fontSize: 25,
      fontWeight: "800",
      color: "#333",
      textAlign: "center",
    },
    signOutButton: {
      width: 150,
      height: 50,
      backgroundColor: "#A53821",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      alignSelf: "center",
    },
    signOutText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    profileButton: {
      borderRadius: 30,
      overflow: 'hidden',
      width: 60,
      height: 60,
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    formContainer: {
      width: '100%',
      marginBottom: 20,
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      width: '100%',
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ccc',
      marginVertical: 5,
      borderRadius: 5,
      width: '100%',
    },
    saveButton: {
      width: '100%',
      height: 50,
      backgroundColor: "#A53821",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    requirementItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 5,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      
    },
  });
  
  