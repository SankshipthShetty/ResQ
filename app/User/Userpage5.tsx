import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
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
  reqstatus: string;
  timestamp: string;
}

const RealTimeChecker = () => {
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
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
        <Pressable key={index} style={styles.card} onPress={() => router.push('./Userpage6')}>
          <Image source={{ uri: user.imageURL }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.location}>{user.locname}</Text>
            <Text style={styles.name}>{user.timestamp}</Text>
            <Text style={styles.phone}>On-duty: {user.dutystatus}</Text>
            <Text style={styles.phone}>Requirements: {user.reqstatus}</Text>
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
});

export default RealTimeChecker;


