// import { Image, StyleSheet, Button, Alert, Modal, View, Text, TouchableOpacity } from "react-native";
// import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { SymbolView } from "expo-symbols";
// import { Colors } from "@/constants/Colors";
// import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
// import { usePermissions } from "expo-media-library";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useState } from "react";

// export default function Onboarding() {
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
//   const [mediaLibraryPermission, requestMediaLibraryPermission] = usePermissions();

//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [showMicrophoneModal, setShowMicrophoneModal] = useState(false);
//   const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);

//   const handleContinue = async () => {
//     setShowCameraModal(true);
//   };

//   const handleCameraPermission = async () => {
//     const cameraStatus = await requestCameraPermission();
//     if (!cameraStatus.granted) {
//       Alert.alert("Error", "Camera permission is required.");
//       return false;
//     }
//     setShowCameraModal(false);
//     setShowMicrophoneModal(true);
//     return true;
//   };

//   const handleMicrophonePermission = async () => {
//     const microphoneStatus = await requestMicrophonePermission();
//     if (!microphoneStatus.granted) {
//       Alert.alert("Error", "Microphone permission is required.");
//       return false;
//     }
//     setShowMicrophoneModal(false);
//     setShowMediaLibraryModal(true);
//     return true;
//   };

//   const handleMediaLibraryPermission = async () => {
//     const mediaLibraryStatus = await requestMediaLibraryPermission();
//     if (!mediaLibraryStatus.granted) {
//       Alert.alert("Error", "Media Library permission is required.");
//       return false;
//     }
//     setShowMediaLibraryModal(false);
//     await AsyncStorage.setItem("hasOpened", "true");
//     router.replace("/(tabs)");
//     return true;
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ParallaxScrollView
//         headerImage={
//           <SymbolView
//             name="camera.circle"
//             size={250}
//             type="hierarchical"
//             animationSpec={{
//               effect: {
//                 type: "bounce",
//               },
//             }}
//             tintColor={Colors.light.snapPrimary}
//             fallback={<Image source={require("@/assets/images/image5.png")} style={styles.reactLogo} />}
//           />
//         }
//         headerBackgroundColor={{
//           dark: "",
//           light: ""
//         }}
//       >
//         <ThemedView style={styles.titleContainer}>
//           <ThemedText type="title">Snapchat Camera!</ThemedText>
//           <HelloWave />
//         </ThemedView>
//         <ThemedView style={styles.stepContainer}>
//           <ThemedText>
//             Welcome, friend! To provide the best experience, this app requires permissions for the following:
//           </ThemedText>
//         </ThemedView>
//         <Button title="Continue" onPress={handleContinue} />
//       </ParallaxScrollView>

//       <PermissionModal
//         visible={showCameraModal}
//         title="Camera Permission"
//         description="🎥 For taking pictures and videos"
//         onRequestPermission={handleCameraPermission}
//         onClose={() => setShowCameraModal(false)}
//       />
//       <PermissionModal
//         visible={showMicrophoneModal}
//         title="Microphone Permission"
//         description="🎙️ For taking videos with audio"
//         onRequestPermission={handleMicrophonePermission}
//         onClose={() => setShowMicrophoneModal(false)}
//       />
//       <PermissionModal
//         visible={showMediaLibraryModal}
//         title="Media Library Permission"
//         description="📸 To save/view your amazing shots"
//         onRequestPermission={handleMediaLibraryPermission}
//         onClose={() => setShowMediaLibraryModal(false)}
//       />
//     </ThemedView>
//   );
// }

// const PermissionModal = ({ visible, title, description, onRequestPermission, onClose }) => (
//   <Modal visible={visible} transparent={true} animationType="slide">
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContainer}>
//         <Text style={styles.modalTitle}>{title}</Text>
//         <Text style={styles.modalDescription}>{description}</Text>
//         <TouchableOpacity style={styles.modalButton} onPress={onRequestPermission}>
//           <Text style={styles.modalButtonText}>Allow</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.modalButton} onPress={onClose}>
//           <Text style={styles.modalButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </Modal>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContainer: {
//     width: 300,
//     padding: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalDescription: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: Colors.light.snapPrimary,
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//     width: '80%',
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });
