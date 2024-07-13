import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MB3: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>These are the donations made</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MB3;
