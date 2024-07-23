import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { firestore } from '../../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import IconButton from '@/components/IconButton';

export default function BloodDonationForm() {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [wardRoomNumber, setWardRoomNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [dateRequiredBy, setDateRequiredBy] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'bloodDonations'), {
        patientName,
        age: Number(age),
        gender,
        bloodType,
        unitsNeeded: Number(unitsNeeded),
        medicalCondition,
        hospitalName,
        hospitalAddress,
        wardRoomNumber,
        contactPerson,
        contactNumber,
        emailAddress,
        urgencyLevel,
        dateRequiredBy,
        timestamp: new Date()
      });
      Alert.alert(
        "Blood donation request submitted successfully!",
        "",
        [
          {
            text: "OK",
            onPress: () => router.push('./0_HomePage'),
          },
        ]
      );
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to submit blood donation request');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          paddingTop: 50,
          left: 20,
          top: -38,
        }}
      >
        <IconButton
          onPress={() => router.back()}
          iosName="arrow.left.circle"
          androidName="arrow-back"
        />
      </View>
      <Text style={styles.heading}>Blood Donation</Text>

      <Text style={styles.title}>Patient Name</Text>
      <TextInput
        style={styles.input}
        value={patientName}
        onChangeText={setPatientName}
      />

      <Text style={styles.title}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.title}>Gender</Text>
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.title}>Blood Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={bloodType}
          onValueChange={(itemValue) => setBloodType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Blood Type" value="" />
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
        </Picker>
      </View>

      <Text style={styles.title}>Units Needed</Text>
      <TextInput
        style={styles.input}
        value={unitsNeeded}
        onChangeText={setUnitsNeeded}
        keyboardType="numeric"
      />

      <Text style={styles.title}>Medical Condition</Text>
      <TextInput
        style={styles.input}
        value={medicalCondition}
        onChangeText={setMedicalCondition}
      />

      <Text style={styles.title}>Hospital Name</Text>
      <TextInput
        style={styles.input}
        value={hospitalName}
        onChangeText={setHospitalName}
      />

      <Text style={styles.title}>Hospital Address</Text>
      <TextInput
        style={styles.input}
        value={hospitalAddress}
        onChangeText={setHospitalAddress}
      />

      <Text style={styles.title}>Ward/Room Number</Text>
      <TextInput
        style={styles.input}
        value={wardRoomNumber}
        onChangeText={setWardRoomNumber}
      />

      <Text style={styles.title}>Contact Person</Text>
      <TextInput
        style={styles.input}
        value={contactPerson}
        onChangeText={setContactPerson}
      />

      <Text style={styles.title}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.title}>Email Address</Text>
      <TextInput
        style={styles.input}
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />

      <Text style={styles.title}>Urgency Level</Text>
      <TextInput
        style={styles.input}
        value={urgencyLevel}
        onChangeText={setUrgencyLevel}
      />

      <Text style={styles.title}>Date Required By</Text>
      <TextInput
        style={styles.input}
        value={dateRequiredBy}
        onChangeText={setDateRequiredBy}
        placeholder="YYYY-MM-DD"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: 'blue',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 25
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
    color: '#495057',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    fontSize: 16,
    elevation: 5,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#bf3924',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
