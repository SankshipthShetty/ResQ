import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';

const DonationUI = ({ onClose }:any) => {
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    console.log(`Donated: ₹${amount}`);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How Much Do You Wish To Donate?</Text>
      {['5000', '10000', '20000', '50000'].map((value) => (
        <TouchableOpacity key={value} onPress={() => setAmount(value)} style={styles.optionButton}>
          <Text style={styles.optionText}>₹{value}</Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  donateButton: {
    backgroundColor: '#A53821',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DonationUI;
