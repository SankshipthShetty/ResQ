import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearProgress } from 'react-native-elements';

interface UploadProgressBarProps {
  progress: number;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Uploading: {Math.round(progress)}%</Text>
      <LinearProgress value={progress / 100} variant="determinate" color="brown" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default UploadProgressBar;
