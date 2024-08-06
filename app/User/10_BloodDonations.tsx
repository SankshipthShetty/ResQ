import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Pressable, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import IconButton from '../../components/IconButton';

// Importing the blood group images
const bloodGroupImages: { [key: string]: any } = {
  'A+': require('../../assets/images/bloodgroup_Ap.png'),
  'A-': require('../../assets/images/bloodgroup_A-.png'),
  'B+': require('../../assets/images/bloodgroup_Bp.png'),
  'B-': require('../../assets/images/bloodgroup_B-.png'),
  'AB+': require('../../assets/images/bloodgroup_ABp.png'),
  'AB-': require('../../assets/images/bloodgroup_AB-.png'),
  'O+': require('../../assets/images/bloodgroup_Op.png'),
  'O-': require('../../assets/images/bloodgroup_O-.png'),
};

interface BloodDonationData {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  bloodType: string;
  unitsNeeded: number;
  medicalCondition: string;
  hospitalName: string;
  hospitalAddress: string;
  wardRoomNumber: string;
  contactPerson: string;
  contactNumber: string;
  emailAddress: string;
  urgencyLevel: string;
  dateRequiredBy: string;
  timestamp: Date;
}

const BloodDonationListScreen = () => {
  const [donations, setDonations] = useState<BloodDonationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<BloodDonationData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'bloodDonations'), (snapshot) => {
      const donationList = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        console.log('Fetched document:', docData); // Detailed debugging log
        return {
          id: doc.id,
          patientName: docData.patientName,
          age: docData.age,
          gender: docData.gender,
          bloodType: docData.bloodType,
          unitsNeeded: docData.unitsNeeded,
          medicalCondition: docData.medicalCondition,
          hospitalName: docData.hospitalName,
          hospitalAddress: docData.hospitalAddress,
          wardRoomNumber: docData.wardRoomNumber,
          contactPerson: docData.contactPerson,
          contactNumber: docData.contactNumber,
          emailAddress: docData.emailAddress,
          urgencyLevel: docData.urgencyLevel,
          dateRequiredBy: docData.dateRequiredBy,
          timestamp: docData.timestamp.toDate(),
        } as BloodDonationData;
      });
      setDonations(donationList);
      setLoading(false);
      console.log('Donation list:', donationList); // Detailed debugging log
    });

    return () => unsubscribe();
  }, []);

  const handleCardPress = (donation: BloodDonationData) => {
    setSelectedDonation(donation);
    setModalVisible(true);
  };

  const getBloodGroupImage = (bloodType: string) => {
    return bloodGroupImages[bloodType] || require('../../assets/images/bloodgroup.png');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A53821" />
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          paddingTop: 50,
          left: 20,
          top: -5,
          
        }}
      >
        <IconButton
          onPress={() => router.replace('./1_HomePage')}
          iosName={'arrow.left.circle'}
          androidName="arrow-back"
        />
      </View>
      <View style={styles.imgview}>
  
      <Image
        source={require('../../assets/images/bloodgroup.png')} // Adjust the path to your image
        style={styles.headerImage}
      />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Blood Donations needed </Text>
  
        {donations.length === 0 ? (
          <Text>No donations available</Text>
        ) : (
          <View style={styles.cardContainer}>
            {donations.map((donation) => (
              <Pressable
                key={donation.id}
                style={styles.card}
                onPress={() => handleCardPress(donation)}
              >
                <Image
                  source={getBloodGroupImage(donation.bloodType)}
                  style={styles.bloodGroupImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Patient Name: {donation.patientName}</Text>
                  <Text style={styles.cardText}>Blood Type: {donation.bloodType}</Text>
                  <Text style={styles.cardText}>Units Needed: {donation.unitsNeeded}</Text>
                  <Text style={styles.cardText}>Urgency Level: {donation.urgencyLevel}</Text>
                  <Text style={styles.cardText}>Date Required By: {donation.dateRequiredBy}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
        {selectedDonation && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Donation Details</Text>
                <Text style={styles.modalText}>Patient Name: {selectedDonation.patientName}</Text>
                <Text style={styles.modalText}>Age: {selectedDonation.age}</Text>
                <Text style={styles.modalText}>Gender: {selectedDonation.gender}</Text>
                <Text style={styles.modalText}>Blood Type: {selectedDonation.bloodType}</Text>
                <Text style={styles.modalText}>Units Needed: {selectedDonation.unitsNeeded}</Text>
                <Text style={styles.modalText}>Medical Condition: {selectedDonation.medicalCondition}</Text>
                <Text style={styles.modalText}>Hospital Name: {selectedDonation.hospitalName}</Text>
                <Text style={styles.modalText}>Hospital Address: {selectedDonation.hospitalAddress}</Text>
                <Text style={styles.modalText}>Ward/Room Number: {selectedDonation.wardRoomNumber}</Text>
                <Text style={styles.modalText}>Contact Person: {selectedDonation.contactPerson}</Text>
                <Text style={styles.modalText}>Contact Number: {selectedDonation.contactNumber}</Text>
                <Text style={styles.modalText}>Email Address: {selectedDonation.emailAddress}</Text>
                <Text style={styles.modalText}>Urgency Level: {selectedDonation.urgencyLevel}</Text>
                <Text style={styles.modalText}>Date Required By: {selectedDonation.dateRequiredBy}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </>
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
  cardContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: 361,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#fff',
  },
  intro:{
    
  }
  ,
  bloodGroupImage: {
    width: 90,
    height: '100%',
    marginRight: 10,
    alignItems: 'center',
   
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#A53821',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '60%',
    height: '80%',
    //centre
    //color:'white',
    alignSelf: 'center',
  },
  imgview: {
    width: '100%',
    height: 400,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BloodDonationListScreen;
