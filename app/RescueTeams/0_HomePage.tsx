// report a disaster ,disaster in your area , donations page

import {
    View,
    Text,
    StatusBar,
    Image,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    ScrollView
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Link, router } from "expo-router";
  import { signOut } from "firebase/auth";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { auth } from "@/constants/firebaseConfig";
  import logo from '../../assets/images/image1.png';

import { onSnapshot, collection, query, where } from "firebase/firestore";
import { firestore } from "@/constants/firebaseConfig";
import moment from "moment";

  


  export default function App() {
    const [fname, setfName] = useState('');

interface DisasterReport {
  id: string;
  imageURL: any;
  location: any;
  locationName: any;
  name: any;
  phoneNumber: any;
  onduty: any;
  requirements: any;
  timestamp: string;
}

const [disasterReports, setDisasterReports] = useState<DisasterReport[]>([]);
const [loading, setLoading] = useState(true);

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
        //const lname= await AsyncStorage.getItem("LastName");
        if (fname ) {
          setfName(fname);
          //setlName(lname);
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
            const timestamp = docData.timestamp?.toDate(); // Convert Firestore Timestamp to JavaScript Date object
            const formattedTimestamp = timestamp
              ? moment(timestamp).format("MMM D, YYYY h:mm A") // Format date as 'Jul 10, 2024 3:30 PM'
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
          setLoading(false); // Set loading to false when data is fetched
        }
      );
    
      // Clean up the subscription
      return () => unsubscribe();
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.textContainerfirst}>
  
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

        <View>
            <Image source={logo} // Adjust the path to your image
              style={styles.iii}/>
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
          <Text style={styles.scrollText}>
            No rescue operations currently on field.
          </Text>
         ) 
         : 
        (
          disasterReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              
              <Image  style={styles.post6Icon}
            source={require("../../assets/images/Edit.png")} />
              
             

              <Image source={{ uri: report.imageURL }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.location}>{report.locationName}</Text>
                  <Text style={styles.timestamp}>{report.timestamp}</Text>
                  <Text style={styles.details}>On-duty: {report.onduty}</Text>
                  <Text style={styles.details}>Requirements: {report.requirements ? 'Uploaded' : 'Not uploaded'}</Text>
                </View>
            </View>
          ))
        )


        }
      </ScrollView>

      </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.resq}>ResQ</Text>
        </View>
        
       
      </View>
    );
  }
  
  const styles = StyleSheet.create({

    
   
    container: {
      top:-10,
      display:"flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      height: "100%",
      width: "100%",
      overflow:"hidden",
      marginBottom: -40,
      marginTop: -150,
      
    },
    textContainer: {
      width: '100%',
      textAlign: "left",
      marginBottom: 0,
      //marginTop:15,
      marginLeft:105,
      top:-90
    },
    textContainerfirst: {
      width: '100%',
      // textAlign: "left",
      marginBottom: 0,
      //marginTop:15,
      marginLeft:105,
      top:-10
    },
    text:{
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign:"left",
      top:39
    },
    iii:{
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
      marginBottom: 20,
      top:50,
      left:-10,
      
    },
    header: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#333',
      left:210,
    },
    profileButton: {
      borderRadius: 25, // Adjust the value to make the image round based on its size
      overflow: 'hidden',
      width: 50, // Adjust the width and height as needed
      height: 50,
      left:-50
    },
    headerImage: {
      width: '100%',
      height: '100%',
      
    },
     scrollBox: {
    width: 360,
    height: 190,
    backgroundColor: "#f0f0f0",
    //bordercolor
   
    borderRadius: 25,
    margin: 10,
    padding: 10,
    left:-10
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
    marginTop:15
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom:10,
    borderWidth: 1,
    borderColor: '#ddd',
    height:120
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
   
  });
  