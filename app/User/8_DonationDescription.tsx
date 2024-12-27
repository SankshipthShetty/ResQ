import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IconButton from '../../components/IconButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FundraiserData {
  description: string;
  id: string;
  img: string;
  name: string;
  organization: string;
  amount: number;
  upiId: string;
}

const UserPage8 = () => {
  const [fundraiserData, setFundraiserData] = useState<FundraiserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | string>('');
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

  const handleDonate = () => {
    if (selectedAmount && fundraiserData) {
      const upiLink = `upi://pay?pa=${fundraiserData.upiId}&pn=${fundraiserData.organization}&am=${selectedAmount}&cu=INR&tn=Donation`;

      Linking.openURL(upiLink).catch((err) => {
        console.error('Error opening UPI app: ', err);
      });

      // Close modal after UPI opens
      setShowDonationModal(false);
    }
  };

  const predefinedAmounts = [100, 500, 1000, 2000];

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
            top: 5,
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
          
            
          
          <View style={styles.imageContainer}>
            <Image source={{ uri: fundraiserData.img }} style={styles.image} />
          </View>
          <Text style={styles.fundraiserTitle}>Fundraiser for: {fundraiserData.name}</Text>
          <Text style={styles.organization}>By {fundraiserData.organization}</Text>
          <Text style={styles.amount}>₹{fundraiserData.amount.toLocaleString()} Raised</Text>
          <Text style={styles.description}>{fundraiserData.description}</Text>
        </View>
      </KeyboardAwareScrollView>

      <Pressable style={styles.donateButton} onPress={() => setShowDonationModal(true)}>
        <Text style={styles.donateButtonText}>Donate</Text>
      </Pressable>


      <Modal visible={showDonationModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Donation Amount</Text>

            <View style={styles.amountOptions}>
              {predefinedAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountButton,
                    selectedAmount === amount && styles.selectedAmountButton,
                  ]}
                  onPress={() => setSelectedAmount(amount)}
                >
                  <Text style={styles.amountText}>₹{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter Custom Amount"
              keyboardType="numeric"
              value={selectedAmount.toString()}
              onChangeText={(text) => setSelectedAmount(text)}
            />

            <Pressable style={styles.modalDonateButton} onPress={handleDonate}>
              <Text style={styles.modalDonateButtonText}>Donate</Text>
            </Pressable>

            <Pressable onPress={() => setShowDonationModal(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
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
  content: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
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
  fundraiserTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 0,
    color: '#A53821',
    alignItems:'center',
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
  description: {
    fontSize: 16,
        color: '#555',
        marginVertical: 10,
        lineHeight: 24,
  },
  donateButton: {
    backgroundColor: '#A53821',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amountOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  amountButton: {
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 5,
  },
  selectedAmountButton: {
    backgroundColor: '#A53821',
  },
  amountText: {
    color: '#333',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 20,
  },
  modalDonateButton: {
    backgroundColor: '#A53821',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalDonateButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  closeModalText: {
    color: '#A53821',
    marginTop: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    title: {
      top:45,
      marginBottom:55,
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
  },
  arange: {
    marginBottom: 0,
    
  },
});

export default UserPage8;
