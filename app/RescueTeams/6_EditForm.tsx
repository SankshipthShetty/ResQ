// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { firestore } from '@/constants/firebaseConfig';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { Ionicons } from '@expo/vector-icons';

// export default function EditReport() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { reportId } = route.params;
//   const [reportData, setReportData] = useState(null);
//   const [newRequirement, setNewRequirement] = useState('');

//   useEffect(() => {
//     const fetchReportData = async () => {
//       const docRef = doc(firestore, "DisasterReports", reportId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         setReportData(docSnap.data());
//       } else {
//         console.log("No such document!");
//       }
//     };

//     fetchReportData();
//   }, [reportId]);

//   const handleUpdateReport = async () => {
//     const docRef = doc(firestore, "DisasterReports", reportId);

//     await updateDoc(docRef, reportData);
//     navigation.goBack();
//   };

//   const handleAddRequirement = () => {
//     if (newRequirement) {
//       setReportData({
//         ...reportData,
//         requirements: [...(reportData.requirements || []), newRequirement],
//       });
//       setNewRequirement('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Edit Report</Text>
//       {reportData && (
//         <ScrollView>
//           <Text style={styles.label}>Location:</Text>
//           <TextInput
//             style={styles.input}
//             value={reportData.locationName}
//             onChangeText={(text) => setReportData({ ...reportData, locationName: text })}
//           />
//           <Text style={styles.label}>On-duty:</Text>
//           <TextInput
//             style={styles.input}
//             value={reportData.onduty}
//             onChangeText={(text) => setReportData({ ...reportData, onduty: text })}
//           />
//           <Text style={styles.label}>Requirements:</Text>
//           {reportData.requirements && reportData.requirements.map((requirement, index) => (
//             <TextInput
//               key={index}
//               style={styles.input}
//               value={requirement}
//               onChangeText={(text) => {
//                 const newRequirements = [...reportData.requirements];
//                 newRequirements[index] = text;
//                 setReportData({ ...reportData, requirements: newRequirements });
//               }}
//             />
//           ))}
//           <View style={styles.addRequirementContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Add new requirement"
//               value={newRequirement}
//               onChangeText={setNewRequirement}
//             />
//             <TouchableOpacity onPress={handleAddRequirement} style={styles.addButton}>
//               <Ionicons name="add-circle" size={24} color="green" />
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity onPress={handleUpdateReport} style={styles.updateButton}>
//             <Text style={styles.updateButtonText}>Update Report</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'white',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginTop: 5,
//   },
//   addRequirementContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButton: {
//     marginLeft: 10,
//   },
//   updateButton: {
//     backgroundColor: '#007BFF',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   updateButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
