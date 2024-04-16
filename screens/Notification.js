import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const NotificationScreen = () => {
  const [changeLogs, setChangeLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore().collection('changeLogs')
      .orderBy('timestamp', 'desc')
      .limit(10) 
      .onSnapshot(snapshot => {
        const logs = [];
        snapshot.forEach(doc => {
          logs.push({ id: doc.id, ...doc.data() });
        });
        setChangeLogs(logs);
      });

    return () => unsubscribe();
  }, []);

  const renderChangeLog = ({ item }) =>(
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.operation}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={changeLogs}
        renderItem={renderChangeLog}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000",
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "#000",
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
});

export default NotificationScreen;
