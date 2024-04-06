import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import EmployeeModal from './EmployeeModal';


const ItemGridView = () => {
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
      id: 3,
      type: 'audio',
      thumbnail: require('../images/download.jpeg'),
      description: 'Podcast Episode',
      spends: '$20',
      dateAdded: '2024-03-29',
    },
    {
      id: 3,
      type: 'audio',
      thumbnail: require('../images/download.jpeg'),
      description: 'Podcast Episode',
      spends: '$20',
      dateAdded: '2024-03-29',
    },
    {
      id: 3,
      type: 'audio',
      thumbnail: require('../images/download.jpeg'),
      description: 'Podcast Episode',
      spends: '$20',
      dateAdded: '2024-03-29',
    },
  ];

  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemLongPress = (item) => {
    setSelectedItem(item);
  };

  const handleEdit = () => {
  };

  const handleDelete = () => {

  };


  const handleItemPress = (item) => { 
    console.log(item)
  }
  const handleButtonPress = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPressArticle = () => {
    console.log('Option pressed: add article');
    setShowOptions(false);
  };

  const handleOptionPressEmployee = () => {
    console.log('Option pressed: add employee');
    setShowModal(true);
    setShowOptions(false);
  }
  const handleCloseOptions = () => {
    setShowOptions(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleItemLongPress(item)}
    >
      <TouchableOpacity style={selectedItem ? styles.editIconContainer : styles.hideEditIconContainer} onPress={() => handleEdit(item)}>
        <Icon name="file-edit-outline" size={20} style={{opacity:1}} />
      </TouchableOpacity>
      <TouchableOpacity style={selectedItem ? styles.deleteIconContainer : styles.hideDeleteIconContainer} onPress={() => handleDelete(item)}>
        <Icon name="delete-circle-outline" size={20} style={{opacity:1}} />
      </TouchableOpacity>
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.spends}>{item.spends}</Text>
      <Text style={styles.dateAdded}>{item.dateAdded}</Text>
    </TouchableOpacity>
  );
  

  return (
    <TouchableWithoutFeedback onPress={handleCloseOptions}>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}><Icon name="plus" size={40} color="#fff" /></Text>
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleOptionPressArticle}>
              <Text style={styles.optionText}><Icon name='book-plus-outline' size={30} color="#fff"></Icon></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleOptionPressEmployee}>
              <Text style={styles.optionText}><Icon name="account-plus-outline" size={30} color="#fff" ></Icon></Text>
            </TouchableOpacity>
          </View>
        )}
        {showModal && (
          <EmployeeModal visible={showModal} onClose={() => setShowModal(false)}/>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  deleteIconContainer: {
    position: 'absolute',
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 5,
    top: 5,
    right: 5,
    zIndex:100,
  },
  hideDeleteIconContainer:{
    display: "none",
  },
  editIconContainer: {
    position: 'absolute',
    backgroundColor:"#fff",
    borderRadius: 100,
    padding: 5,
    top: 5,
    left: 5,
    zIndex:100,
  },
  hideEditIconContainer:{
    display: "none",
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
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation : 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 50,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 95,
    right: 25,
  },
  option: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginVertical: 8
  },
  optionText: {
    color: '#fff',
    fontSize: 90,
  },
});

export default ItemGridView;