import {
  View,
  Text,
  TextInput,
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
import { auth, firestore } from "../../constants/firebaseConfig"; // Ensure you import firestore here
import { collection, addDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import IconButton from "../../components/IconButton";

// Define the Requirement type
type Requirement = {
  type: string;
  quantityNeeded: number;
  quantityCollected: number;
};

export default function App() {
  const [fname, setfName] = useState('');
  const [numCamps, setNumCamps] = useState('');
  const [campCounts, setCampCounts] = useState<number[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [newRequirement, setNewRequirement] = useState<Requirement>({ type: '', quantityNeeded: 0, quantityCollected: 0 });
  const [TeamName, setTeamName] = useState("def");
  const [DisasterReportId, setDisasterReportId] = useState('');
  const [numDays, setNumDays] = useState('');

  useEffect(() => {
    const fetchTeamName = async () => {
      const name = await AsyncStorage.getItem('FirstName');
      if (name) {
        setTeamName(name);
      }
    };

    const fetchDisasterReportId = async () => {
      const id = await AsyncStorage.getItem('DISID');
      if (id) {
        setDisasterReportId(id);
      }
    };

    fetchTeamName();
    fetchDisasterReportId();
  }, []);

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
    setNewRequirement({ type: '', quantityNeeded: 0, quantityCollected: 0 });
  };

  const handleSaveRequirements = async () => {
    if (!DisasterReportId) {
      console.error("Disaster report ID is not set");
      return;
    }

    try {
      const reportRef = doc(firestore, 'DisasterReports', DisasterReportId);
      await updateDoc(reportRef, {
        requirementstatus: true,
        onduty: TeamName,
        requirements: arrayUnion(...requirements),
        numCamps: numCamps,
        campCounts: campCounts,
        numDays: numDays,
      });

      const disasterDonorsRef = collection(reportRef, 'DisasterDonors');

      // Process each requirement
      for (const req of requirements) {
        const reqDocRef = doc(disasterDonorsRef, req.type);

        // Create or update the document in DisasterDonors
        await setDoc(reqDocRef, {
          TotalQuantityCollected: 0,
          QuantityNeeded: req.quantityNeeded,
        }, { merge: true });
      }

      console.log("Requirements added successfully!");
      router.push('./4_ConfirmDisaster');
    } catch (error) {
      console.error("Error adding requirements: ", error);
    }
  };

  const handleNumCampsChange = (value: string) => {
    const numCampsInt = parseInt(value, 10);
    setNumCamps(numCampsInt.toString());
    setCampCounts(Array(numCampsInt).fill(0));
  };

  const handleCampCountChange = (index: number, value: string) => {
    const numMembers = parseInt(value, 10);
    const newCampCounts = [...campCounts];
    newCampCounts[index] = numMembers;
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

  return(
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          paddingTop: 50,
          left: 15,
          top: 5,
        }}
      >
        <IconButton
          onPress={() => router.back()} // This will navigate back to the previous screen
          iosName={'arrow.left.circle'}
          androidName="arrow-back"
        />
        </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.textContainer}>
            <Text style={styles.text}>Rescue Team Details</Text>
        </View>
        <Text style={styles.text}>Hi, {fname} 👋</Text>

        <Text style={styles.heading}>Please select the requirements needed</Text>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Number of Camps"
            value={numCamps.toString()}
            onChangeText={handleNumCampsChange}
            style={styles.input}
            keyboardType="numeric"
          />
          {campCounts.map((count, index) => (
            <TextInput
              key={index}
              placeholder={`Number of people in camp ${index + 1}`}
              value={count.toString()}
              onChangeText={(value) => handleCampCountChange(index, value)}
              style={styles.input}
              keyboardType="numeric"
            />
          ))}
          <TextInput
            placeholder="Number of Days"
            value={numDays.toString()}
            onChangeText={(value) => setNumDays(parseInt(value, 10).toString())}
            style={styles.input}
            keyboardType="numeric"
          />
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
            <Picker.Item label="Litchi" value="Litchi" />
            <Picker.Item label="Mango" value="Mango" />
            <Picker.Item label="Papaya" value="Papaya" />
            {/* Add more items as needed */}
          </Picker>
          <TextInput
            placeholder="Enter Quantity"
            value={newRequirement.quantityNeeded.toString()} // Convert number to string for TextInput
            onChangeText={(text) => {
              // Convert text to number; if parsing fails, default to 0
              const quantity = text === '' ? 0 : parseFloat(text);
              setNewRequirement({ ...newRequirement, quantityNeeded: quantity });
            }}
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
      
        <View style={styles.footer}>
        <Text style={styles.resq}>ResQ</Text>
      </View>
      </ScrollView>

    </View>
  );}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 20,
      top:0,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent:'flex-start',
    },
    textContainer: {
      width: '100%',
      textAlign: "center",
      top:15,
      marginBottom: 0,
      justifyContent: 'center',
    },
    text: {
      fontSize: 25,
      top:30,
      marginBottom: 15,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
    },
    heading: {
      fontSize: 20,
      marginTop: 30,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: "bold",
    },
    formContainer: {
      marginBottom: 30,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      marginBottom: 10,
      width: '100%',
    },
    picker: {
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      marginBottom: 10,
      width: '100%',
    },
    saveButton: {
      width: "100%",
      height: 50,
      backgroundColor: "#CD853F",
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      alignSelf: "center",
      marginBottom:10,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    requirementItem: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 2,
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
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    footer: {
      position: 'absolute',
      bottom: 0, // Adjust as needed
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    resq: {
      fontSize: 25,
      fontWeight: "800",
      color: "#333",
      textAlign: "center",
    },
  });
  