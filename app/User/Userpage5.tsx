import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Modal, TouchableOpacity, Linking, Alert } from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { useRouter } from 'expo-router';
import IconButton from '@/components/IconButton';

interface TestData {
  id: string;
  imageURL: string;
  lOC: string;
  NAME: string;
  PHONE: string;
  locname: string;
  dutystatus: string;
  reqstatus: boolean; // Assuming reqstatus is a boolean
  timestamp: string;
}

const RealTimeChecker = () => {
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TestData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'DisasterReports'), (snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        const timestamp = docData.timestamp?.toDate(); // Convert Firestore Timestamp to JavaScript Date object
        const formattedTimestamp = timestamp
          ? moment(timestamp).format('MMM D, YYYY h:mm A') // Format date as 'Jul 10, 2024 3:30 PM'
          : 'Unknown Time';
        return {
          id: doc.id,
          imageURL: docData.imageUrl,
          lOC: docData.location,
          locname: docData.locationName,
          NAME: docData.name,
          PHONE: docData.phoneNumber,
          dutystatus: docData.onduty,
          reqstatus: docData.requirements,
          timestamp: formattedTimestamp,
        } as TestData;
      });
      setData(newData);
      setLoading(false); // Set loading to false when data is fetched
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const handlePress = (report: TestData) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const handleNavigate = () => {
    router.push('./Userpage6'); // Change './NextPage' to the actual path of your next page
    handleCloseModal();
  };

  const handleOpenInMaps = (location: string) => {
    const coordinates = location.match(/Lat: ([\d.]+), Lon: ([\d.]+)/);
    if (coordinates && coordinates.length === 3) {
      const lat = coordinates[1];
      const lon = coordinates[2];
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Invalid location format');
    }
  };

  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A53821" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={30}
    >
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
          onPress={() => router.replace('./Userpage1')} // This will navigate back to the previous screen
          iosName={'arrow.left.circle'}
          androidName="arrow-back"
        />
      </View>
      <Text style={styles.title}>Disasters in your area</Text>
      {data.map((user, index) => (
        <Pressable key={index} style={styles.card} onPress={() => handlePress(user)}>
          <Image source={{ uri: user.imageURL }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.location}>{user.locname}</Text>
            <Text style={styles.name}>{user.timestamp}</Text>
            <Text style={styles.phone}>On-duty: {user.dutystatus}</Text>
            <Text style={styles.phone}>Requirements: {user.reqstatus ? 'Uploaded' : 'Not uploaded'}</Text>
          </View>
        </Pressable>
      ))}

      {selectedReport && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Disaster Details</Text>
              <Image source={{ uri: selectedReport.imageURL }} style={styles.modalImage} />
              <Text style={styles.modalText}>Location: <Text style={styles.link} onPress={() => handleOpenInMaps(selectedReport.lOC)}>Open in Maps</Text></Text>
              <Text style={styles.modalText}>Name: {selectedReport.NAME}</Text>
              <Text style={styles.modalText}>Phone: {selectedReport.PHONE}</Text>
              <Text style={styles.modalText}>On-duty: {selectedReport.dutystatus}</Text>
              <Text style={styles.modalText}>Requirements: {selectedReport.reqstatus ? 'Uploaded' : 'Not uploaded'}</Text>
              <Text style={styles.modalText}>Time: {selectedReport.timestamp}</Text>
              {selectedReport.reqstatus ? (
                <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                  <Text style={styles.buttonText}>Go to Requirements</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noRequirementsText}>Requirements not uploaded</Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    top: -5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: 361,
    height: 120,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 30,
    marginLeft: 2,
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  name: {
    fontSize: 14,
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  noRequirementsText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  navigateButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eb8d71',
    borderRadius: 30,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#D9534F',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RealTimeChecker;
