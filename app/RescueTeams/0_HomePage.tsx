import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../constants/firebaseConfig";
import logo from '../../assets/images/image1.png';

import { onSnapshot, collection, query, where, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../constants/firebaseConfig";
import moment from "moment";

const markComp = () => {
  console.log("Operation marked as completed");
};

export default function App() {
  // Define the editpage function
  const editpage = () => {
    console.log("Edit page function called");
    router.push({
      pathname: './6_EditForm', // Adjust the path according to your navigation setup
      params: { reportId: selectedReportId }, // Pass the selected report ID
    });
  };
  const [fname, setfName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [requirements, setRequirements] = useState<{ type: string; quantityNeeded: string; quantityCollected: string; }[]>([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [disasterReports, setDisasterReports] = useState<{ id: string; imageURL: any; location: any; locationName: any; name: any; phoneNumber: any; onduty: any; requirements: any; timestamp: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [numCamps, setNumCamps] = useState(0);
  const [campCounts, setCampCounts] = useState<number[]>([]);
  const [numDays, setNumDays] = useState(0); // New state for Number of Days

  const fetchRequirements = async (reportId: string) => {
    try {
      const reportRef = doc(firestore, 'DisasterReports', reportId);
      const docSnap = await getDoc(reportRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const reqs = data.requirements || [];
        const formattedRequirements = reqs.map((req: any) => ({
          type: req.type,
          quantityNeeded: req.quantityNeeded,
          quantityCollected: req.quantityCollected,
        }));
        setRequirements(formattedRequirements);
        setNumCamps(data.numCamps || 0);
        setCampCounts(data.campCounts || []);
        setNumDays(data.numDays || 0);
      }
    } catch (error) {
      console.error("Error fetching requirements: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../auth/Login'); // Adjust the path to your login page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "DisasterReports"), where("requirementstatus", "==", true)),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const timestamp = docData.timestamp?.toDate();
          
          const formattedTimestamp = timestamp
            ? moment(timestamp).format("MMM D, YYYY h:mm A")
            : "Unknown Time";
          return {
            id: doc.id,
            imageURL: docData.imageUrl,
            location: docData.location,
            locationName: docData.locationName,
            name: docData.name,
            phoneNumber: docData.phoneNumber,
            onduty: docData.onduty,
            requirements: docData.requirementstatus,
            timestamp: formattedTimestamp,
          };
        });
        setDisasterReports(newData);
        setLoading(false);
      }
    );

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const handleShowRequirements = async (reportId: string) => {
    await AsyncStorage.setItem('selectedReportId', reportId); 
    fetchRequirements(reportId);
    setSelectedReportId(reportId);
    setModalVisible(true);
   
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainerfirst}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Rescue Team Details</Text>
          <TouchableOpacity onPress={() => router.push("../../ProfilePageEdit/RescueProf")} style={styles.profileButton}>
            <Image
              source={require('../../assets/images/profilepic.png')}
              style={styles.headerImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Hi, {fname} 👋</Text>
      </View>

      <View>
        <Image source={logo} style={styles.iii} />
      </View>

      <TouchableOpacity onPress={() => router.push("./1_CamPermission")} style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/alert.png")}
        />
        <Text style={styles.boxText}>Report a Disaster</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./4_ConfirmDisaster")} style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/map.png")}
        />
        <Text style={styles.boxText}>Disaster in your area</Text>
      </TouchableOpacity>

      <View style={styles.scrollContainer}>
        <Text style={styles.scrollTitle}>Rescue Operations on Field</Text>
        <ScrollView style={styles.scrollBox}>
          {loading ? (
            <Text style={styles.scrollText}>Loading...</Text>
          ) : disasterReports.length === 0 ? (
            <Text style={styles.scrollText}>No rescue operations currently on field.</Text>
          ) : (
            disasterReports.map((report) => (
              <TouchableOpacity key={report.id} style={styles.reportCard} onPress={() => handleShowRequirements(report.id)}>
                <Image source={{ uri: report.imageURL }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.location}>{report.locationName}</Text>
                  <Text style={styles.timestamp}>{report.timestamp}</Text>
                  <Text style={styles.details}>On-duty: {report.onduty}</Text>
                  <Text style={styles.details}>Requirements: {report.requirements ? 'Uploaded' : 'Not uploaded'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.resq}>ResQ</Text>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Submitted Requirements</Text>
              <Text style={styles.modalSubtitle}>Number of Camps: {numCamps}</Text>
              <Text style={styles.modalSubtitle}>Number of Days: {numDays}</Text> 

              {campCounts.map((members, index) => (
                <Text key={index} style={styles.modalSubtitle}>Members in Camp {index + 1}: {members}</Text>
                
              ))}
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementText}>
                    {req.type}: {req.quantityNeeded} KG/L needed, {req.quantityCollected} KG/L collected
                  </Text>
                </View>
              ))}
            </ScrollView>


            <TouchableOpacity onPress={() => editpage()} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity> 

            
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButtonClose}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>


          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: -10,
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    marginBottom: -40,
    marginTop: -150,
  },
  textContainer: {
    width: '100%',
    textAlign: "left",
    marginBottom: 0,
    marginLeft: 105,
    top: -90
  },
  textContainerfirst: {
    width: '100%',
    marginBottom: 0,
    marginLeft: 105,
    top: -10
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    top: 39
  },
  iii: {
    width: 250,
    height: 150,
    alignSelf: 'center',
    top: 10,
    left: 0,
  },
  box: {
    width: 360,
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  boxText: {
    color: "#000000",
    fontSize: 24,
    paddingLeft: 20,
    fontWeight: "800",
    marginLeft: 120,
  },
  resq: {
    top: 0,
    left: -25,
    marginTop: 20,
    fontSize: 25,
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    width: 173,
    height: 29,
    position: "absolute",
    color: "#000000",
  },
  post5Icon: {
    top: 30,
    left: 35,
    width: 80,
    height: 80,
    position: "absolute",
    fontSize: 6,
  },
  post6Icon: {
    top: 75,
    left: 304,
    width: 25,
    height: 25,
    position: "absolute",
    fontSize: 6,
  },
  signOutButton: {
    width: 150,
    height: 50,
    backgroundColor: "#A53821",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
    marginTop: 10,
    top: 35,
    left: -20,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    left: 210,
  },
  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 50,
    height: 50,
    left: -50
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  scrollBox: {
    width: 360,
    height: 190,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    margin: 10,
    padding: 10,
    left: -10
  },
  scrollText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  scrollContainer: {
    width: 360,
    margin: 10,
  },
  scrollTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: 15
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 120
  },
  reportText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 30,
    marginLeft: 2,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  requirementItem: {
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 14,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#DE5959',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 150,
  },

  modalButtonClose: {
    marginTop: 20,
    backgroundColor: '#580202',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
