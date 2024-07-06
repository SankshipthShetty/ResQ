import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const ExampleScreen = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');

  const handleUploadPicture = () => {
    // Implement your logic for uploading a picture here
    // For example, you can navigate to a screen for uploading pictures
    //router.push('./UploadPictureScreen');
  };

  const handleWriteDescription = () => {
    // Implement your logic for writing a text description
    // For example, navigate to a screen for writing text
    // router.push('./WriteDescriptionScreen');
  };

  const handleSOS = () => {
    // Implement your logic for SOS functionality
    // This could include sending alerts or triggering actions
    // router.push('./SOSScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Information</Text>
<View style={styles.bluetoothContainer}>
      {/* Button for uploading a picture */}
      <TouchableOpacity style={styles.button} onPress={handleUploadPicture}>
        <Text style={styles.buttonText}>Upload Picture</Text>
      </TouchableOpacity>

      {/* Text input for writing text description */}
      <TextInput
        style={styles.descriptionInput}
        placeholder="Write description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      </View>

      {/* SOS button with special effects */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#A52A2A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionInput: {
    flex: 1,
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top', // Ensures text starts from the top
    backgroundColor: '#ffffff',
  },
  sosButton: {
    backgroundColor: '#A52A2A',
    borderRadius: 100, // Makes it round
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  bluetoothContainer: {
    width: '80%',
    height:'30%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },

  bluetoothContainer1: {
    flex: 1,
    width: '80%',
    height:'30%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    elevation: 3,
  },
});

export default ExampleScreen;
