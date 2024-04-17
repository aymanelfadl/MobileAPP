import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const NotificationScreen = () => {
  const [changeLogs, setChangeLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore().collection('changeLogs')
      .orderBy('timestamp', 'desc')
      .limit(20) 
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000",
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  item: {
    backgroundColor:'rgba(240, 240, 240, 0.9)',
    padding: 20,
    marginBottom:8,
    borderRadius: 15,
    color: "#000",
  },
  itemText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#000",
  },
});

export default NotificationScreen;
