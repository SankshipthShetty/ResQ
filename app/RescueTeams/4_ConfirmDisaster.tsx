//
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Modal, TouchableOpacity, Linking, Alert } from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc, DocumentData } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { useRouter } from 'expo-router';
import IconButton from '@/components/IconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TestData {
  id: string;
  imageURL: string;
  location: string; // Adjusted to match Firestore field name
  locationName: string; // Adjusted to match Firestore field name
  name: string; // Adjusted to match Firestore field name
  phoneNumber: string; // Adjusted to match Firestore field name
  onduty: string; // Adjusted to match Firestore field name
  requirements: boolean; // Adjusted to match Firestore field name
  timestamp: string;
}

const RealTimeChecker = () => {
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TestData | null>(null);
  const [TeamName, setTeamName] = useState("def"); // Set your default rescue team name

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
          location: docData.location,
          locationName: docData.locationName,
          name: docData.name,
          phoneNumber: docData.phoneNumber,
          onduty: docData.onduty,
          requirements: docData.requirementstatus,
          timestamp: formattedTimestamp,
        } as TestData;
      });
      setData(newData);
      setLoading(false); // Set loading to false when data is fetched
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    const fetchTeamName = async () => {
      const name = await AsyncStorage.getItem('FirstName');
      if (name) {
        setTeamName(name);
      }
    };

    fetchTeamName();
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
    router.push('./Userpage6'); // Change './Userpage6' to the actual path of your next page
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

  const handleMarkRequirement = async (report: TestData) => {
   
     router.push('./5_RequirementForm'); // Change './Userpage6' to the actual path of your next page
     await AsyncStorage.setItem('DISID', report.id);
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
          onPress={() => router.replace('../auth/Login')} // This will navigate back to the previous screen
          iosName={'arrow.left.circle'}
          androidName="arrow-back"
        />
      </View>
      <Text style={styles.title}>Disasters in your area</Text>

      
      {data
      .sort((a, b) => (a.requirements === b.requirements ? 0 : a.requirements ? -1 : 1))
      .map((report, index) => (
        <Pressable key={index} style={styles.card} onPress={() => handlePress(report)}>
          <Image source={{ uri: report.imageURL }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.location}>{report.locationName}</Text>
            <Text style={styles.name}>{report.timestamp}</Text>
            <Text style={styles.phone}>On-duty: {report.onduty}</Text>
            <Text style={styles.phone}>Requirements: {report.requirements ? 'Uploaded' : 'Not uploaded'}</Text>
            <Pressable
              style={[
                styles.statusButton,
                report.requirements ? styles.greenBackground : styles.redBackground,
              ]}
              onPress={() => handleMarkRequirement(report)}
              disabled={report.requirements} // Disable button when requirements are already uploaded
            >
              <Text style={styles.buttonText}>
                {report.requirements ? 'On field' : 'Confirm'}
              </Text> 

              
            </Pressable>
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
              <Text style={styles.modalText}>Location: <Text style={styles.link} onPress={() => handleOpenInMaps(selectedReport.location)}>Open in Maps</Text></Text>
              <Text style={styles.modalText}>Name: {selectedReport.name}</Text>
              <Text style={styles.modalText}>Phone: {selectedReport.phoneNumber}</Text>
              <Text style={styles.modalText}>On-duty: {selectedReport.onduty}</Text>
              <Text style={styles.modalText}>Requirements: {selectedReport.requirements ? 'Uploaded' : 'Not uploaded'}</Text>
              <Text style={styles.modalText}>Time: {selectedReport.timestamp}</Text>
              {selectedReport.requirements ? (
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
    top:10,
    left:-15
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
    marginBottom: 10,
    fontStyle: 'italic',
  },
  navigateButton: {
    backgroundColor: '#A53821',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#A53821',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    //fontWeight: 'bold',
    // top:-10,
    // left:10
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    width: 60,
    left: 170,
    top: -60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBackground: {
    backgroundColor: '#038001',
  },
  redBackground: {
    backgroundColor: '#cc3d04',
  },
});

export default RealTimeChecker;