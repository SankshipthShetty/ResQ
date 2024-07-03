// report a disaster ,disaster in your area , donations page

import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/constants/firebaseConfig";

export default function App() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../auth/Login'); // Adjust the path to your login page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("./Userpage2")} style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/alert.png")}
        />
        <Text style={styles.boxText}>Report a Disaster</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/map.png")}
        />
        <Text style={styles.boxText}>Disaster in your area</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/Donation.png")}
        />
        <Text style={styles.boxText}>Donation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box}>
        <Image
          style={styles.post5Icon}
          source={require("../../assets/images/history.png")}
        />
        <Text style={styles.boxText}>Your History</Text>
      </TouchableOpacity>
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
    display:"flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: 926,
    overflow:"hidden",
    marginTop: -100,
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
    marginTop: 30,
    fontSize: 25,
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    width: 173,
    height: 59,
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
});
