import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { useRouter } from 'expo-router';
import IconButton from '@/components/IconButton';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/constants/firebaseConfig';

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

const MiddleBody = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TestData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchName = async () => {
      const name = await AsyncStorage.getItem('OrgName');
      if (name) {
        setName(name);
      }
    };

    fetchName();
  }, []);

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
          requirements: docData.requirements || [],
        } as TestData;
      });
      setData(newData);
      setLoading(false); // Set loading to false when data is fetched
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../auth/Login'); // Adjust the path to your login page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handlePress = (report: TestData) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const handleNavigate = () => {
    if (selectedReport) {
      router.push({
        pathname: './MB2',
        params: { report: JSON.stringify(selectedReport) },
      });
      handleCloseModal();
    }
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
      <View> 
      {/*style={styles.headerContainer}> */}
        {/* <Text style={styles.headerText}>Hello, {name} 👋</Text> */}
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Disasters in your Locality</Text>
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
              <Text style={styles.modalText}>
                Location:{' '}
                <Text style={styles.link} onPress={() => handleOpenInMaps(selectedReport.lOC)}>
                  Open in Maps
                </Text>
              </Text>
              <Text style={styles.modalText}>Name: {selectedReport.NAME}</Text>
              <Text style={styles.modalText}>Phone: {selectedReport.PHONE}</Text>
              <Text style={styles.modalText}>On-duty: {selectedReport.dutystatus}</Text>
              <Text style={styles.modalText}>
                Requirements: {selectedReport.reqstatus ? 'Uploaded' : 'Not uploaded'}
              </Text>
              <Text style={styles.modalText}>Time: {selectedReport.timestamp}</Text>
              {selectedReport.reqstatus ? (
                <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                  <Text style={styles.buttonText}>See Details</Text>
                </TouchableOpacity>
              ) : null}
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#A53821',
    padding: 10,
    borderRadius: 5,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 0,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#888',
  },
  phone: {
    fontSize: 16,
    color: '#888',
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
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#A53821',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#0000FF',
    textDecorationLine: 'underline',
  },
});

export default MiddleBody;