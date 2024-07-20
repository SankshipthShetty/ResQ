import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import IconButton from '@/components/IconButton';

interface TestData {
  id: string;
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

  if (!parsedReport) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No report data available.</Text>
      </View>
    );
  }

  // Calculate the ratio of fully collected requirements
  const requirements = parsedReport.requirements || [];
  const fullyCollectedRequirements = requirements.filter(req => req.quantityNeeded == '0' );
  const totalRequirements = requirements.length;
  const collectedRatio = `${fullyCollectedRequirements.length}/${totalRequirements}`;

  const openMap = (location: string) => {
    const [latitude, longitude] = location.split(',');
    const url = `http://maps.google.com/?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleViewDonations =()=>{
    router.push({
      pathname: './3_ViewDonors',
      params: { report: JSON.stringify(parsedReport) }
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 15,
          top: -40,
        }}
      >
        <IconButton
          onPress={() => router.back()} // This will navigate back to the previous screen
          iosName={"arrow.left.circle"}
          androidName="arrow-back"
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

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 25 }}>Submitted Requirements:</Text>

      <View style={styles.card2}>
        <View style={styles.rowContainer}>
          <Image source={require('../../assets/images/map-icon.png')} style={styles.map} />
          <TouchableOpacity style={{ flex: 1, alignContent: 'flex-start' }} onPress={() => openMap(parsedReport.lOC)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{parsedReport.locname}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <Text style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: 2 ,marginTop:5}}>Last updated on:</Text>
          <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>Last updated by: {parsedReport.dutystatus}</Text>
        </View>
      </View>

      <View>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 40, marginBottom: 20, fontSize: 25 }}>Donations From Users</Text>
      </View>
      <View style={styles.card2}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 2, fontSize: 20 }}>Requirements Satisfied:</Text>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10, fontSize: 22 }}>{`${collectedRatio}`}</Text>
        <TouchableOpacity style={styles.button}  onPress={handleViewDonations}>
          <Text style={{ color: '#fff', fontWeight: 'bold',fontSize:20, textAlign:'center' }}>View Donations</Text>
        </TouchableOpacity>
      </View>
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
});

export default MB2;
