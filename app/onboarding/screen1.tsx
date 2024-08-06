import React from "react";
import { View, Text, Button, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import DotIndicator from "../../components/dotindicator";

import logo from "../../assets/images/image4.png";

const SplashScreen1 = () => {
  const router = useRouter();

  const handleSkip = () => {
    router.replace("../auth/Login");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.btext}>Skip</Text>
      </Pressable>
      <Image source={logo} style={styles.Image} />
      <Text style={styles.title}>Welcome to ResQ</Text>
      <Text style={styles.text}>
        Empowering communities for effective disaster management and recovery.
        Together, we can make a difference.
      </Text>
      <DotIndicator currentIndex={0} />
      <Pressable onPress={() => router.push("./screen2")} style={styles.button}>
        <Text style={{ color: "white", fontSize: 17 }}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -45,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    marginLeft: 15,
    marginRight: 15,
  },
  Image: {
    width: 400,
    height: 350,
    marginBottom: 30,
  },
  btext: {
    color: "#A53821",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    top: 90,
    right: 20,
    padding: 10,
  },
  button: {
    width: 80,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#A53821",
    position: "absolute",
    bottom: 50,
  },
});

export default SplashScreen1;
