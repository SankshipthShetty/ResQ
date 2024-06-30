import React from 'react';
import { View, StyleSheet } from 'react-native';

const DotIndicator = ({ currentIndex }: { currentIndex: number }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, currentIndex === 0 && styles.activeDot]} />
      <View style={[styles.dot, currentIndex === 1 && styles.activeDot]} />
      {/* <View style={[styles.dot, currentIndex === 2 && styles.activeDot]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'lightgray',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#A53821',
  },
});

export default DotIndicator;
