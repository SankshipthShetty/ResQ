//Uh Oh! Network Not found PAGE 
//This page is displayed when the user is offline and the network is not found


import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={[styles.uhOhNetwork, styles.uhOhNetworkTypo]}>
        Uh Oh! Network Not found
      </Text>
      <Text style={[styles.youreOffline, styles.uhOhNetworkTypo]}>
        You’re Offline!
      </Text>

      <Image
        style={styles.offlinePage1Child}
        source={require("../../assets/images/peaceamoeba.png")}
      />
      <Image
        style={[styles.noWifi1Icon, styles.noWifi1IconPosition]}
        source={require("../../assets/images/wifi.png")}
      />

      <View style={styles.offlinePage1Item} />
      <Text style={[styles.enableBluetooth, styles.noWifi1IconPosition]}>
        Enable Bluetooth
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: 926,
    overflow: "hidden",
    marginTop: -100,
  },
  uhOhNetwork: {
    top: 250,
  },
  uhOhNetworkTypo: {
    fontWeight: "700",
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 34,
    textAlign: "center",
    color: "#000000",
    width: "100%",
    position: "absolute",
  },
  youreOffline: {
    top: 305,
    textAlign: "center",
    color: "#000000",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
    lineHeight: 34,
    width: "100%",
    position: "absolute",
  },
  offlinePage1Child: {
    top: 420,
    width: 300,
    justifyContent: "center",
    height: 255,
    left: "40%",
    transform: [{ translateX: -106 }],
    position: "absolute",
  },
  noWifi1Icon: {
    top: 460,
    width: 187,
    height: 181,
    left: "40%",
    transform: [{ translateX: -58.5 }],
    position: "absolute",
  },
  offlinePage1Item: {
    top: 760,
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#A52A2A",
    width: 221,
    height: 48,
    left: "50%",
    transform: [{ translateX: -110.5 }],
    position: "absolute",
  },
  noWifi1IconPosition: {
    textAlign: "center",
    position: "absolute",
  },
  enableBluetooth: {
    top: 769,
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "800",
    fontFamily: '"Gothic A1", sans-serif',
    color: "#FFFFFF",
    lineHeight: 24,
    left: "60%",
    transform: [{ translateX: -110.5 }],
    textAlign: "center",
  },
});
