import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Alert, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import BleManager from "react-native-ble-manager";

export default function Userpage2() {
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [showWiFiModal, setShowWiFiModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    BleManager.start({ showAlert: false });
    setShowBluetoothModal(true);
  }, []);

  const handleBluetoothPermission = async () => {
    try {
      await BleManager.enableBluetooth();
      setShowBluetoothModal(false);
      setShowWiFiModal(true);
      return true;
    } catch (error) {
      Alert.alert("Error", "Unable to enable Bluetooth.");
      return false;
    }
  };

  const handleWiFiPermission = async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected || networkState.type !== Network.NetworkStateType.WIFI) {
      Alert.alert(
        "WiFi is off",
        "Please enable WiFi from settings",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => openSettings() },
        ],
        { cancelable: false }
      );
      return false;
    }
    setShowWiFiModal(false);
    await AsyncStorage.setItem("hasOpened", "true");
    router.push("./Userpage3");
    return true;
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <PermissionModal
        visible={showBluetoothModal}
        title="Bluetooth Permission"
        description="🔵 Allow access to Bluetooth"
        onRequestPermission={handleBluetoothPermission}
        onClose={() => {
          Alert.alert("Error", "Bluetooth permission is required.");
        }}
      />
      <PermissionModal
        visible={showWiFiModal}
        title="WiFi Permission"
        description="📶 Allow access to WiFi"
        onRequestPermission={handleWiFiPermission}
        onClose={() => {
          Alert.alert("Error", "WiFi permission is required.");
        }}
      />
    </View>
  );
}

interface PermissionModalProps {
  visible: boolean;
  title: string;
  description: string;
  onRequestPermission: () => void;
  onClose: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ visible, title, description, onRequestPermission, onClose }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalDescription}>{description}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onRequestPermission}>
          <Text style={styles.modalButtonText}>Allow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: "center",
  },    
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
   },
 });
