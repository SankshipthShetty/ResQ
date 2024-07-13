import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { firestore } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import IconButton from '@/components/IconButton';

interface FundraiserData {
  id: string;
  img: string;
  name: string;
  organization: string;
  amount: number;
}

const UserPage7 = () => {
  const [fundraisers, setFundraisers] = useState<FundraiserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'Donations'), (snapshot) => {
      const newFundraisers = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        return {
          id: doc.id,
          img: docData.img,
          name: docData.name,
          organization: docData.organization,
          amount: docData.amount,
        } as FundraiserData;
      });
      setFundraisers(newFundraisers);
      setLoading(false); // Set loading to false when data is fetched
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

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
          onPress={() => router.replace('./1_HomePage')}
          iosName={'arrow.left.circle'}
          androidName="arrow-back"
        />
      </View>
  
      <Text style={styles.title}>Fundraisers</Text>
      {fundraisers.map((fundraiser) => (
        <Pressable
          key={fundraiser.id}
          style={styles.card}
          
        >
          <Image source={{ uri: fundraiser.img }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{fundraiser.name}</Text>
            <Text style={styles.organization}>{fundraiser.organization}</Text>
            <Text style={styles.amount}>₹{fundraiser.amount.toLocaleString()} Raised</Text>
            <Pressable style={styles.donateButton}>
              <Text style={styles.donateButtonText} onPress={() => router.push({ pathname: './8_DonationDescription', params: { fundraiser: fundraiser.id } })}>Donate</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  organization: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  amount: {
    fontSize: 14,
    color: '#A53821',
    marginBottom: 10,
  },
  donateButton: {
    backgroundColor: '#A53821',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPage7;
