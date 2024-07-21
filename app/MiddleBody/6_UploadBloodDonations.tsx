import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { firestore } from '../../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Blood Donation Request Form</Text>
      </View>

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
      <TextInput
        style={styles.input}
        value={bloodType}
        onChangeText={setBloodType}
      />

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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
    color: 'grey',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#D9534F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
