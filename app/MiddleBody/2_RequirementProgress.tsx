import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Modal, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import IconButton from '../../components/IconButton';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../constants/firebaseConfig';

interface TestData {
  id: string;
  completed: boolean;
  imageURL: string;
  lOC: string;
  NAME: string;
  PHONE: string;
  locname: string;
  dutystatus: string;
  reqstatus: boolean;
  timestamp: string;
  requirements: Array<{
    quantityCollected: string;
    quantityNeeded: string;
    type: string;
  }>;
}


const MB2: React.FC = () => {
  const { report } = useLocalSearchParams<{ report: string }>();
  const parsedReport: TestData = report ? JSON.parse(report) : null;
  const imageURL = parsedReport?.imageURL.replace('/ReportedPictures/', '/ReportedPictures%2F');
  const [showModal, setShowModal] = useState(false);

  if (!parsedReport) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No report data available.</Text>
      </View>
    );
  }

  // Calculate the ratio of fully collected requirements
  const requirements = parsedReport.requirements || [];
  const fullyCollectedRequirements = requirements.filter(req => req.quantityNeeded === '0');
  const totalRequirements = requirements.length;
  const collectedRatio = `${fullyCollectedRequirements.length}/${totalRequirements}`;

  const openMap = (location: string) => {
    const [latitude, longitude] = location.split(',');
    const url = `http://maps.google.com/?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleViewDonations = () => {
    router.push({
      pathname: './3_ViewDonors',
      params: { report: JSON.stringify(parsedReport) },
    });
  };

  useEffect(() => {
    if (parsedReport.completed) {
      setShowModal(true);
    }
  }, [parsedReport.completed]);

  const handleDeleteReport = () => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'DisasterReports', parsedReport.id));
              Alert.alert("Report deleted successfully");
              console.log('Deleted record', parsedReport);
              setShowModal(false);
              router.back(); // Navigate back to the previous screen
            } catch (error) {
              Alert.alert("Error deleting report");
            }
          }
        }
      ]
    );
  };

  console.log('Parsed Report:', parsedReport); // Debug statement
  console.log('Collected Ratio:', collectedRatio); // Debug statement

  return (
    <View style={styles.container}>
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Rescue Requirement marked Completed</Text>
              <Text style={styles.modalText}>Would you like to delete the disaster report?</Text>
              <TouchableOpacity style={styles.button1} onPress={handleDeleteReport}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => setShowModal(false)}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          paddingTop: 50,
          left: 15,
          top: -40,
        }}
      >
        <IconButton
          onPress={() => router.back()} // This will navigate back to the previous screen
          iosName={'arrow.left.circle'}
          androidName='arrow-back'
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Details</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: imageURL }} style={styles.image} />
          <View style={styles.detailsContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.text}>{parsedReport.NAME}</Text>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.text}>{parsedReport.PHONE}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Requirement:</Text>
                <Text style={styles.text}>{parsedReport.reqstatus ? 'Uploaded' : 'Not uploaded'}</Text>
                <Text style={styles.label}>On-duty:</Text>
                <Text style={styles.text}>{parsedReport.dutystatus}</Text>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.text}>{parsedReport.locname}</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.timestamp}>{parsedReport.timestamp}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 25 }}>Submitted Requirements:</Text>

      <View style={styles.card2}>
        <View style={styles.rowContainer}>
          <Image source={require('../../assets/images/map-icon.png')} style={styles.map} />
          <TouchableOpacity style={{ flex: 1, alignContent: 'flex-start' }} onPress={() => openMap(parsedReport.lOC)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{parsedReport.locname}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <Text style={{ textAlign: 'left', fontWeight: 'bold' , marginTop:10}}>Updated by: {parsedReport.dutystatus}</Text>
        </View>
      </View>

      <View>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 15, marginBottom: 20, fontSize: 25 }}>Donations From Users</Text>
      </View>

      {/* Conditionally render the button */}
      {totalRequirements > 0 && (
        <View style={styles.card2}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 2, fontSize: 20 }}>Requirements Satisfied:</Text>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10, fontSize: 22 }}>{`${collectedRatio}`}</Text>
          <TouchableOpacity style={styles.button} onPress={handleViewDonations}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>View Donations</Text>
          </TouchableOpacity>
        </View>
      )}

      {totalRequirements == 0 && (
        <View style={styles.card2}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 2, fontSize: 20 }}>Requirements Satisfied:</Text>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10, fontSize: 22 }}>{`${collectedRatio}`}</Text>
          {/* <TouchableOpacity style={styles.button} onPress={handleViewDonations}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>View Donations</Text>
          </TouchableOpacity> */}
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    position: 'relative',
    marginBottom: 20,
  },
  card2: {
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    position: 'relative',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  columnContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 15,
    marginBottom: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'flex-end', // Align items to the start of the container
    marginBottom: -8,
  },
  timestamp: {
    fontSize: 13,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  map: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 10,
  },
  separator: {
    borderBottomColor: '#000', // Line color
    borderBottomWidth: 1, // Line thickness
    marginTop: 10,
    width: '100%',
  },
  button: {
    backgroundColor: 'brown', // Brown color
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    width: 200,
    height: 40,
  },
  button1: {
    backgroundColor: 'green', // Brown color
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    width: 160,
    height: 40,
  },
  button2: {
    backgroundColor: 'maroon', // Brown color
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    width: 160,
    height: 40,
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
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MB2;
