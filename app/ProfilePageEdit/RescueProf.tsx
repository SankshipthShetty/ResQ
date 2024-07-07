import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../constants/firebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RescueDetailsScreen = () => {
  const router = useRouter();
  const { RescueId } = useLocalSearchParams();
  const [RescueDetails, setRescueDetails] = useState<any>(null);

  useEffect(() => {
    const fetchRescueDetails = async () => {
      try {
        let storedRescueId: string | null = null;

        if (typeof RescueId === "string") {
          storedRescueId = RescueId;
        } else {
          storedRescueId = await AsyncStorage.getItem("RescueId");
        }

        if (storedRescueId) {
          console.log(`Fetching details for RescueId: ${storedRescueId}`);
          const docRef = doc(firestore, "RescueTeamData", storedRescueId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Rescue details found:", docSnap.data());
            setRescueDetails(docSnap.data());
          } else {
            console.log(`No document found for RescueId: ${storedRescueId}`);
            Alert.alert("Error", "Rescue Team details not found.");
          }
        } else {
          console.log("No RescueId found");
          Alert.alert("Error", "Rescue Team ID not found.");
        }
      } catch (error: any) {
        console.error("Error fetching Rescue details:", error.message);
        Alert.alert("Error", "Failed to fetch Rescue details.");
      }
    };

    fetchRescueDetails();
  }, [RescueId]);

  const handleEdit = () => {
    router.push({
      pathname: "./EditRescueDetails",
      params: { RescueId },
    });
  };

  if (!RescueDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/userprof.png")} // Adjust the path to your image
          style={styles.headerImage}
        />
        <Text style={styles.header}>Rescue Team Details</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.email || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.phoneNumber || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Team Name</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.teamName || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Name</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.contactName || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.address || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Members</Text>
          <TextInput
            style={styles.input}
            value={RescueDetails.numMem || ""}
            editable={false}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
        <Text style={styles.saveButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    top: 70,
  },
  headerImage: {
    width: 60,
    height: 50,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    marginLeft: 10,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    top: 70,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#e9ecef",
    color: "#495057",
  },
  saveButton: {
    backgroundColor: "#A53821",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    top: 70,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RescueDetailsScreen;
