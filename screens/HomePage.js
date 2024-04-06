import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import ItemGridView from '../components/ItemGridView';
const HomePage = () => {
  
  return (
    <View style={styles.container}>
      <ItemGridView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomePage;
