//main signup page 
import React from "react";
import { Pressable } from "react-native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import logo from "../../assets/images/image1.png";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} />
      <Text style={styles.logoText}>ResQ</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("../auth/UserSignUp")}
      >
        <Image
          style={styles.loginIcon}
          source={require("../../assets/images/man.png")}
        />
        <Text style={styles.loginButtonText}>Register as a User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("../auth/RescueTeam")}
      >
        <Image
          style={styles.loginIcon}
          source={require("../../assets/images/Team.png")}
        />
        <Text style={styles.loginButtonText}>Register as a Rescue Team</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("../auth/MiddleBody")}
      >
        <Image
          style={styles.loginIcon}
          source={require("../../assets/images/middlebody.png")}
        />
        <Text style={styles.loginButtonText}>Register as a Middle Body</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Already have an account?</Text>
      <Pressable onPress={() => router.push('./MiddleBody')}>
        <Text style={styles.signInText}>Sign In</Text>
      </Pressable>

      <Text style={styles.mottoText}>
        Strength is found in unity, and hope in our shared humanity.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 70,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logoImage: {
    width: 350,
    height: 200,
    alignSelf: "center",
  
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#000",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: "80%",
    height: 85,
    justifyContent: "center",
  },
  loginIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  loginButtonText: {
    fontSize:18,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  signUpText: {
    color: "#A52A2A",
    fontWeight: "bold",
  },
  mottoText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#888",
  },
  signupLink: {
    color: "#A53821",
    marginLeft: 5,
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A53821',
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
