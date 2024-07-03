// report a disaster ,disaster in your area , donations page

import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";

export default function App() {
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
    width: 400,
    height: 150,
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
    fontFamily: "Poppins-ExtraBold",
    fontWeight: "800",
    marginLeft: 120,
  },
  resq: {
    top: 0,
    left: -25,
    marginTop: 30,
    fontSize: 25,
    fontWeight: "800",
    fontFamily: "Poppins-ExtraBold",
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
});
