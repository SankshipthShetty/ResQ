import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../constants/firebaseConfig";
import { useRouter } from 'expo-router';

const EditPage = () => {
  const [reportId, setReportId] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<{ type: string; quantityNeeded: string; quantityCollected: string; }[]>([]);
  const [numCamps, setNumCamps] = useState<number>(0);
  const [campCounts, setCampCounts] = useState<number[]>([]);
  const [numDays, setNumDays] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchReportId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedReportId');
        setReportId(id);
        if (id) {
          fetchReportDetails(id);
        }
      } catch (error) {
        console.error("Error fetching report ID: ", error);
      }
    };

    fetchReportId();
  }, []);

  const fetchReportDetails = async (reportId: string) => {
    try {
      const reportRef = doc(firestore, 'DisasterReports', reportId);
      const docSnap = await getDoc(reportRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRequirements(data.requirements || []);
        setNumCamps(data.numCamps || 0);
        setCampCounts(data.campCounts || []);
        setNumDays(data.numDays || 0);
        setCompleted(data.completed || false);
      }
    } catch (error) {
      console.error("Error fetching report details: ", error);
    }
  };

  const handleSave = async () => {
    if (reportId) {
      try {
        const reportRef = doc(firestore, 'DisasterReports', reportId);
        await updateDoc(reportRef, {
          requirements,
          numCamps,
          campCounts,
          numDays,
          completed
        });
        Alert.alert("Success", "Report updated successfully");
      } catch (error) {
        console.error("Error updating report: ", error);
        Alert.alert("Error", "Failed to update report");
      }
    }
  };

  const handleRequirementChange = (index: number, field: string, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = { ...updatedRequirements[index], [field]: value };
    setRequirements(updatedRequirements);
  };

  const handleRemoveRequirement = async (index: number) => {
    if (reportId) {
      const updatedRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(updatedRequirements);
      try {
        const reportRef = doc(firestore, 'DisasterReports', reportId);
        await updateDoc(reportRef, {
          requirements: updatedRequirements
        });
        Alert.alert("Success", "Requirement removed successfully");
      } catch (error) {
        console.error("Error removing requirement: ", error);
        Alert.alert("Error", "Failed to remove requirement");
      }
    }
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, { type: '', quantityNeeded: '', quantityCollected: '' }]);
  };

  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Disaster Report</Text>
      {requirements.map((req, index) => (
        <View key={index} style={styles.formGroup}>
          <Text style={styles.label}>Type:</Text>
          <Picker
            selectedValue={req.type}
            style={styles.picker}
            onValueChange={(itemValue: string) => handleRequirementChange(index, 'type', itemValue)}
          >
            <Picker.Item label="Select Requirement" value="" />
            <Picker.Item label="Apple" value="Apple" />
            <Picker.Item label="Banana" value="Banana" />
            <Picker.Item label="Grapes" value="Grapes" />
            <Picker.Item label="Jackfruit" value="Jackfruit" />
            <Picker.Item label="Lemon" value="Lemon" />
            <Picker.Item label="Litchi" value="Litchi" />
            <Picker.Item label="Mango" value="Mango" />
            <Picker.Item label="Papaya" value="Papaya" />
          </Picker>
          <Text style={styles.label}>Quantity Needed:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={req.quantityNeeded}
            onChangeText={(text) => handleRequirementChange(index, 'quantityNeeded', text)}
          />
          <Text style={styles.label}>Quantity Collected:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={req.quantityCollected}
            onChangeText={(text) => handleRequirementChange(index, 'quantityCollected', text)}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveRequirement(index)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRequirement}>
        <Text style={styles.addButtonText}>Add Requirement</Text>
      </TouchableOpacity>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Camps:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numCamps.toString()}
          onChangeText={(text) => setNumCamps(Number(text))}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Camp Counts (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={campCounts.join(',')}
          onChangeText={(text) => setCampCounts(text.split(',').map(Number))}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Days:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numDays.toString()}
          onChangeText={(text) => setNumDays(Number(text))}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mark as Completed:</Text>
        <Switch
          value={completed}
          onValueChange={setCompleted}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonclose} onPress={handleClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      
      flex: 1,
      padding: 46,
  
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 8,
      fontSize: 16,
    },
    picker: {
      height: 50,
      width: '100%',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 4,
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#460707',
      padding: 16,
      borderRadius: 40,
      alignItems: 'center',
      marginBottom:90
    },
    buttonclose: {
      backgroundColor: '#460707',
      padding: 16,
      borderRadius: 900,
      alignItems: 'center',
      marginBottom:90,
      top:-65,
     
    },
    
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#28a745',
      padding: 16,
      borderRadius: 4,
      alignItems: 'center',
      marginBottom: 16,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    removeButton: {
      backgroundColor: '#dc3545',
      padding: 8,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 8,
    },
    removeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });


export default EditPage;
