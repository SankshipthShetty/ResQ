import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { firestore, storage } from '../../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import IconButton from '../../components/IconButton';

export default function MB2Page() {
  const [amount, setAmount] = useState('');
  const [imgUri, setImgUri] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImgUri(result.assets[0].uri);
        console.log('Image URI:', result.assets[0].uri);
      } else {
        console.log('Image picker was cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmit = async () => {
    if (!ifscCode && !accountNumber && !upiId) {
      Alert.alert('Validation Error', 'Please provide either IFSC Code, Account Number, or UPI ID');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = '';
      if (imgUri) {
        console.log('Starting image upload');
        const response = await fetch(imgUri);
        const blob = await response.blob();
        console.log('Blob created:', blob);

        const storageRef = ref(storage, `DonationPic/${new Date().getTime()}`);
        console.log('Storage reference created:', storageRef);

        const uploadTask = uploadBytesResumable(storageRef, blob);
        console.log('Upload task created:', uploadTask);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Upload failed', error);
            Alert.alert('Upload failed', 'Please try again later');
            setUploading(false);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', imageUrl);

            // Save the download URL and other data to Firestore
            await addDoc(collection(firestore, 'Donations'), {
              amount,
              img: imageUrl,
              name,
              organization,
              accountNumber,
              ifscCode,
              upiId,
              email,
              description,
              timestamp: new Date(),
            });

            setAmount('');
            setImgUri('');
            setName('');
            setOrganization('');
            setAccountNumber('');
            setIfscCode('');
            setUpiId('');
            setEmail('');
            setDescription('');
            setUploading(false);
            router.push('./0_HomePage');
          }
        );
      } else {
        console.log('No image selected, saving data without image');
        // If no image is selected, just save other data to Firestore
        await addDoc(collection(firestore, 'Donations'), {
          amount,
          img: imageUrl,
          name,
          organization,
          accountNumber,
          ifscCode,
          upiId,
          email,
          description,
          timestamp: new Date(),
        });

        setAmount('');
        setImgUri('');
        setName('');
        setOrganization('');
        setAccountNumber('');
        setIfscCode('');
        setUpiId('');
        setEmail('');
        setDescription('');
        setUploading(false);
      }
    } catch (error) {
      console.error('Error uploading data: ', error);
      Alert.alert('Upload failed', 'Please try again later');
      setUploading(false);
    }
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

      <Text style={styles.heading}>Donation Page</Text>
      <Text style={styles.title}>Amount to be collected</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
      <Text style={styles.title}>Image</Text>
      {imgUri ? (
        <Image source={{ uri: imgUri }} style={styles.image} />
      ) : (
        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.title}>Organization</Text>
      <TextInput
        style={styles.input}
        value={organization}
        onChangeText={setOrganization}
        placeholder="Enter organization name"
      />
      {/* <Text style={styles.title}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter account number"
      />
      <Text style={styles.title}>IFSC Code</Text>
      <TextInput
        style={styles.input}
        value={ifscCode}
        onChangeText={setIfscCode}
        placeholder="Enter IFSC code"
      /> */}
      <Text style={styles.title}>UPI ID/IFCS code/Acc num</Text>
      <TextInput
        style={styles.input}
        value={upiId}
        onChangeText={setUpiId}
        placeholder="Enter UPI ID"
      />
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter your email"
      />
      <Text style={styles.title}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline={true}
        placeholder="Enter description"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 25,
    textAlign: 'center',
    
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePickerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#DEE2E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#bf3924', // Changed to red
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
