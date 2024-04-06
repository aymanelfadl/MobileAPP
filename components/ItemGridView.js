import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const ItemGridView = () => {
  // Sample data
  const data = [
    {
      id: 1,
      type: 'image',
      thumbnail: require('../images/download.jpeg'),
      description: 'Beautiful Landscape',
      spends: '$50',
      dateAdded: '2024-04-01',
    },
    {
      id: 2,
      type: 'audio',
      thumbnail: require('../images/download.jpeg'),
      description: 'Podcast Episode',
      spends: '$20',
      dateAdded: '2024-03-29',
    },
    {
      id: 2,
      type: 'audio',
      thumbnail: require('../images/download.jpeg'),
      description: 'Podcast Episode',
      spends: '$20',
      dateAdded: '2024-03-29',
    },

  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.spends}>{item.spends}</Text>
      <Text style={styles.dateAdded}>{item.dateAdded}</Text>
    </TouchableOpacity>
  );

  const handlePress = (item) => {
    console.log('Item pressed:', item);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  spends: {
    fontSize: 14,
    marginBottom: 2,
  },
  dateAdded: {
    fontSize: 12,
    color: '#666',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ItemGridView;
