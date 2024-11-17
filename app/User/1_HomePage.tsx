// import {
//   View,
//   Text,
//   StatusBar,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Link, router } from "expo-router";
// import { signOut } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth } from "../../constants/firebaseConfig";

// export default function App() {
//   const [fname, setfName] = useState('');
//   const [lname, setlName] = useState('');
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem('isLoggedIn');
//       router.replace('../auth/Login'); // Adjust the path to your login page
//     } catch (error) {
//       console.error('Error signing out: ', error);
//     }
//   };

//   useEffect(() => {
//     const fetchName = async () => {
//       const fname = await AsyncStorage.getItem("FirstName");
//       const lname= await AsyncStorage.getItem("LastName");
//       if (fname && lname) {
//         setfName(fname);
//         setlName(lname);
//       }
//     };

//     fetchName();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.textContainer}>

//       <View style={styles.headerContainer}>
//         <Text style={styles.header}></Text>
//         <TouchableOpacity onPress={() => router.push("../../ProfilePageEdit/UserProf")} style={styles.profileButton}>
//           <Image
//             source={require('../../assets/images/profilepic.png')} // Adjust the path to your image
//             style={styles.headerImage}
//           />
//         </TouchableOpacity>
//       </View>

//         <Text style={styles.text}>Hi,{fname} {lname} 👋</Text>
//       </View>
//       <TouchableOpacity onPress={() => router.push("./2_CamPermission")} style={styles.box}>
//         <Image
//           style={styles.post5Icon}
//           source={require("../../assets/images/alert.png")}
//         />
//         <Text style={styles.boxText}>Report a Disaster</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("./5_DisasterReports")} style={styles.box}>
//         <Image
//           style={styles.post5Icon}
//           source={require("../../assets/images/map.png")}
//         />
//         <Text style={styles.boxText}>Disaster in your area</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.box} onPress={() => router.push("./7_DonationReports")} >
//         <Image
//           style={styles.post5Icon}
//           source={require("../../assets/images/Donation.png")}
//         />
//         <Text style={styles.boxText}>Donation</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("./10_BloodDonations")} style={styles.box}>
      
//         <Image
//           style={styles.post5Icon}
//           source={require("../../assets/images/blood-test.png")}
//         />
//         <Text style={styles.boxText}>Blood Donation required</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//       <View>
//         <Text style={styles.resq}>ResQ</Text>

//        {/* <TouchableOpacity  onPress={() => router.push("../Offline/Offlinep1")} style={styles.check} >
//         <Text >Just for Checking Purpose</Text>
//       </TouchableOpacity> */}
      
      
//       </View>


     

//     </View>
//   );
// }

import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "../../constants/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import * as Location from 'expo-location';

export default function App() {
  const [fname, setfName] = useState('');
  const [lname, setlName] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../auth/Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleReportDisaster = () => {
    Alert.alert(
      "Report a Disaster",
      "Choose a reporting option",
      [
        {
          text: "Report with Image",
          onPress: () => router.push("./2_CamPermission"),
        },
        {
          text: "Quick Report",
          onPress: handleQuickReport,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleQuickReport = async () => {
    try {
      const location = await getCurrentLocation();
      await addDoc(collection(firestore, 'DisasterReports'), {
        name: `${fname} ${lname}`,
        locationName: location || "Unknown Location",
        location: location,
        phoneNumber: "6362531671", // Add default or empty fields as required
        onduty: "None",
        requirementstatus: false,
        completed: false,
        timestamp: new Date(),
      });
      Alert.alert("Quick Report Submitted Successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Failed to submit report. Try again.");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return null;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      return `Lat: ${coords.latitude}, Lon: ${coords.longitude}`;
    } catch (error) {
      console.error("Error fetching location: ", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      const fname = await AsyncStorage.getItem("FirstName");
      const lname= await AsyncStorage.getItem("LastName");
      if (fname && lname) {
        setfName(fname);
        setlName(lname);
      }
    };
    fetchName();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}></Text>
          <TouchableOpacity onPress={() => router.push("../../ProfilePageEdit/UserProf")} style={styles.profileButton}>
            <Image
              source={require('../../assets/images/profilepic.png')}
              style={styles.headerImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Hi, {fname} {lname} 👋</Text>
      </View>

      <TouchableOpacity onPress={handleReportDisaster} style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/alert.png")}
        />
        <Text style={styles.boxText}>Report a Disaster</Text>
      </TouchableOpacity>

      {/* Other buttons */}
      
      {/* <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.resq}>ResQ</Text> */}

      
             <TouchableOpacity onPress={() => router.push("./5_DisasterReports")} style={styles.box}>
         <Image
          style={styles.post5Icon}
          source={require("../../assets/images/map.png")}
        />
        <Text style={styles.boxText}>Disaster in your area</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => router.push("./7_DonationReports")} >
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/Donation.png")}
        />
        <Text style={styles.boxText}>Donation</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./10_BloodDonations")} style={styles.box}>
      
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/blood-test.png")}
        />
        <Text style={styles.boxText}>Blood Donation required</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.resq}>ResQ</Text>

       {/* <TouchableOpacity  onPress={() => router.push("../Offline/Offlinep1")} style={styles.check} >
        <Text >Just for Checking Purpose</Text>
      </TouchableOpacity> */}
      
      
      </View>


     

    </View>
  );
}
  

// Styles go here (same as your original styles)

const styles = StyleSheet.create({
  check:{
    position: 'absolute',
    bottom:735,
    left: 10,
    backgroundColor: '#A53821',
    padding: 10,
    borderRadius: 10
},
  container: {
    top:-30,
    display:"flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    overflow:"hidden",
    marginBottom: -40,
    marginTop: -70,
    
  },
  textContainer: {
    width: '100%',
    textAlign: "left",
    marginBottom: 0,
    marginTop:15,
    marginLeft:55,
  },
  text:{
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign:"left"
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
    top:-35
    
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    left:270
  },
  profileButton: {
    borderRadius: 25, // Adjust the value to make the image round based on its size
    overflow: 'hidden',
    width: 50, // Adjust the width and height as needed
    height: 50,
    left:-50,
    bottom:-95,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    
  },
 
});


