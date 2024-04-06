// screens/NotificationScreen.js

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: "#000"}}>This is the Notification Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationScreen;
