// import {
//     View,
//     Text,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//   } from "react-native";
//   import React, { useEffect, useState } from "react";
//   import { router } from "expo-router";
//   import { signOut } from "firebase/auth";
//   import AsyncStorage from "@react-native-async-storage/async-storage";
//   import { auth } from "@/constants/firebaseConfig";
  
//   export default function App() {
//     const [fname, setfName] = useState('');
  
//     const handleSignOut = async () => {
//       try {
//         await signOut(auth);
//         await AsyncStorage.removeItem('isLoggedIn');
//         router.replace('../auth/Login'); // Adjust the path to your login page
//       } catch (error) {
//         console.error('Error signing out: ', error);
//       }
//     };
  
//     useEffect(() => {
//       const fetchName = async () => {
//         const fname = await AsyncStorage.getItem("FirstName");
//         if (fname) {
//           setfName(fname);
//         }
//       };
  
//       fetchName();
//     }, []);
  
//     return (
//       <View style={styles.container}>
//         <View style={styles.textContainer}>
//           <View style={styles.headerContainer}>
//             <Text style={styles.header}>Rescue Team Details</Text>
//             <TouchableOpacity onPress={() => router.push("../../ProfilePageEdit/RescueProf")} style={styles.profileButton}>
//               <Image
//                 source={require('../../assets/images/profilepic.png')} // Adjust the path to your image
//                 style={styles.headerImage}
//               />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.text}>Hi, {fname} 👋</Text>
//         </View>
//         <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//           <Text style={styles.signOutText}>Sign Out</Text>
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.resq}>ResQ</Text>
//         </View>
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "white",
//       height: "100%",
//       width: "100%",
//     },
//     textContainer: {
//       width: '100%',
//       textAlign: "left",
//       marginBottom: 0,
//       marginTop: 15,
//       marginLeft: 55,
//     },
//     text: {
//       fontSize: 30,
//       fontWeight: "bold",
//       marginBottom: 20,
//       textAlign: "left"
//     },
//     resq: {
//       marginTop: 20,
//       fontSize: 25,
//       fontWeight: "800",
//       position: "absolute",
//       color: "#000000",
//     },
//     signOutButton: {
//       width: 150,
//       height: 50,
//       backgroundColor: "#A53821",
//       borderRadius: 10,
//       justifyContent: "center",
//       alignItems: "center",
//       marginTop: 20,
//     },
//     signOutText: {
//       color: "#FFFFFF",
//       fontSize: 18,
//       fontWeight: "bold",
//     },
//     headerContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       width: '100%',
//       top: 20,
//     },
//     header: {
//       fontSize: 15,
//       fontWeight: 'bold',
//       color: '#333',
//       left:185,
//     },
//     profileButton: {
//       borderRadius: 60,
//       overflow: 'hidden',
//       width: 60,
//       height:60,
//       left : -60

//     },
//     headerImage: {
//       width: '100%',
//       height: '100%',
    
//     },
//   });
  