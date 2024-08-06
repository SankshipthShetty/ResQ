import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IconButton from '../../components/IconButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ReactNode } from 'react';
import DonationUI from '../../components/donationui';  // Import the new component

interface FundraiserData {
  description: ReactNode;
  id: string;
  img: string;
  name: string;
  organization: string;
  amount: number;
}

const UserPage8 = () => {
  const [fundraiserData, setFundraiserData] = useState<FundraiserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonationUI, setShowDonationUI] = useState(false);  // State to control donation UI visibility
  const router = useRouter();
  const { fundraiser } = useLocalSearchParams();

  useEffect(() => {
    if (fundraiser) {
      const fetchFundraiser = async () => {
        const docRef = doc(firestore, 'Donations', fundraiser as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFundraiserData(docSnap.data() as FundraiserData);
        }
        setLoading(false);
      };

      fetchFundraiser();
    }
  }, [fundraiser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A53821" />
      </View>
    );
  }

  if (!fundraiserData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No fundraiser data found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 1880 }]}
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
            onPress={() => router.replace('./7_DonationReports')}
            iosName={'arrow.left.circle'}
            androidName="arrow-back"
          />
        </View>
        <View style={styles.arange}>
          <View style={styles.header}>
            <Text style={styles.title}>Donations</Text>
          </View>
          <View style={styles.header}>
            <Text style={styles.fundraiserTitle}>{fundraiserData.name}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: fundraiserData.img }} style={styles.image} />
          </View>
          <Text style={styles.organization}>By {fundraiserData.organization}</Text>
          <Text style={styles.amount}>₹{fundraiserData.amount.toLocaleString()} Raised</Text>
          <Text style={styles.description}>{fundraiserData.description}</Text>
        </View>
      </KeyboardAwareScrollView>

      <Pressable style={styles.donateButton} onPress={() => setShowDonationUI(true)}>
        <Text style={styles.donateButtonText}>Donate</Text>
      </Pressable>

      <Modal visible={showDonationUI} transparent={true}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setShowDonationUI(false)}
        >
          <View style={styles.modalContent}>
            <DonationUI onClose={() => setShowDonationUI(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  arange: {
    marginBottom: 20,
  },
  fundraiserTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#A53821',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    lineHeight: 24,
  },
  organization: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
  amount: {
    fontSize: 18,
    color: '#A53821',
    marginVertical: 5,
  },
  donateButton: {
    backgroundColor: '#A53821',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20, // Adjust bottom position as needed
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default UserPage8;
