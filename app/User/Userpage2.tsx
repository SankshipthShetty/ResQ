// PERMISSIONS FOR CAMERA


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Alert, TouchableOpacity } from "react-native";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { usePermissions } from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Userpage2() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = usePermissions();

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMicrophoneModal, setShowMicrophoneModal] = useState(false);
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);

  useEffect(() => {
    setShowCameraModal(true);
  }, []);

  const handleCameraPermission = async () => {
    const cameraStatus = await requestCameraPermission();
    if (!cameraStatus.granted) {
      Alert.alert("Error", "Camera permission is required.");
      return false;
    }
    setShowCameraModal(false);
    setShowMicrophoneModal(true);
    return true;
  };

  const handleMicrophonePermission = async () => {
    const microphoneStatus = await requestMicrophonePermission();
    if (!microphoneStatus.granted) {
      Alert.alert("Error", "Microphone permission is required.");
      return false;
    }
    setShowMicrophoneModal(false);
    setShowMediaLibraryModal(true);
    return true;
  };

  const handleMediaLibraryPermission = async () => {
    const mediaLibraryStatus = await requestMediaLibraryPermission();
    if (!mediaLibraryStatus.granted) {
      Alert.alert("Error", "Media Library permission is required.");
      return false;
    }
    setShowMediaLibraryModal(false);
    await AsyncStorage.setItem("hasOpened", "true");
    router.push("./Userpage3") // Change the route to Userpage3
    return true;
  };

  return (
    <View style={styles.container}>
      <PermissionModal
        visible={showCameraModal}
        title="Camera Permission"
        description="🎥 For taking pictures"
        onRequestPermission={handleCameraPermission}
        onClose={() => {
          Alert.alert("Error", "Camera permission is required.");
        }}
      />
      <PermissionModal
        visible={showMicrophoneModal}
        title="Microphone Permission"
        description="🎙️ For taking videos with audio"
        onRequestPermission={handleMicrophonePermission}
        onClose={() => {
          Alert.alert("Error", "Microphone permission is required.");
        }}
      />
      <PermissionModal
        visible={showMediaLibraryModal}
        title="Media Library Permission"
        description="📸 To save/view the images"
        onRequestPermission={handleMediaLibraryPermission}
        onClose={() => {
          Alert.alert("Error", "Media Library permission is required.");
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
