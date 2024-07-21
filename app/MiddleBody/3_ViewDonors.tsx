import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
    quantityCollected: number;
    quantityNeeded: number;
    type: string;
  }>;
}

interface Donor {
  userfname: string;
  userlname: string;
  quantityDonated: number;
}

const ViewDonors: React.FC = () => {
  const { report } = useLocalSearchParams<{ report: string }>();
  const parsedReport: TestData = report ? JSON.parse(report) : null;

  const [donors, setDonors] = useState<{ [key: string]: Donor[] }>({});
  const db = getFirestore();

  useEffect(() => {
    const fetchDonors = async () => {
      if (!parsedReport) return;

      const disasterDonorsColRef = collection(db, 'DisasterReports', parsedReport.id, 'DisasterDonors');
      const disasterDonorsColSnap = await getDocs(disasterDonorsColRef);

      const donorsData: { [key: string]: Donor[] } = {};
      disasterDonorsColSnap.forEach(doc => {
        const requirementType = doc.id;
        const data = doc.data();
        donorsData[requirementType] = data.Donors || [];
      });

      setDonors(donorsData);
    };

    fetchDonors();
  }, [parsedReport]);

  if (!parsedReport) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No report data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.headerText}>Rescue Operation at {parsedReport.locname}</Text>
      <Text style={styles.subHeaderText}>Donations Supplied</Text>
      <View style={styles.requirementsContainer}>
        {parsedReport.requirements.map((req, index) => (
          <View key={index} style={styles.requirementBox}>
            <View style={styles.requirementHeader}>
              <Text style={styles.requirementText}>Requirement {index + 1}</Text>
              <Text style={styles.requirementType}>{req.type}</Text>
            </View>

            <View style={styles.centeredContainer}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(req.quantityCollected / (req.quantityCollected + req.quantityNeeded)) * 100}%`,
                      backgroundColor: 'green',
                    }
                  ]}
                />
                <View style={styles.progressBarBorder} />
              </View>
              <Text style={styles.progressText}>{req.quantityCollected}/{req.quantityCollected + req.quantityNeeded}</Text>
            </View>

            <Text style={styles.recentText}>Recent Donors</Text>
            {donors[req.type]?.length ? (
              donors[req.type].map((donor, index) => (
                <View key={index} style={styles.donorBox}>
                  <Text style={styles.donorText}>{donor.userfname} {donor.userlname} - {donor.quantityDonated} unit</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDonorsText}>No donors yet</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  requirementsContainer: {
    marginTop: 10,
  },
  requirementBox: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    justifyContent: 'center',
    height: 12,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 0,
  },
  progressBarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  requirementType: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  recentText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  donorBox: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 5,
  },
  donorText: {
    fontSize: 14,
    color: '#555',
  },
  noDonorsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ViewDonors;
