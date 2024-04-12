import React, { useState,useEffect } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, Button} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const defaultPicture = require('../images/digital-nomad-35.png');



const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState(defaultPicture);

  const handleLaunchCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
     } else {
        if (response.uri) {
          setAvatar(response.base64);
        } else {
          console.log('Image source URI is null');
        }
      }
    });
  };
  
  const handleLaunchImageLibrary = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        if (response.uri) {
          setAvatar(response.uri);
        } else {
          console.log('Image source URI is null');
        }
      }
    });
  };
  
  const handleSubmit = () => {
    console.log('Name:', name);
    console.log('Last Name:', lastName);
    console.log('Avatar:', avatar);
    // Close the modal
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Employee</Text>
          <Image source={avatar} style={styles.avatar} />
          <Button title="Take Photo" onPress={handleLaunchCamera} />
          <Button title="Choose from Library" onPress={handleLaunchImageLibrary} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Button title="Add Employee" onPress={handleSubmit} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default EmployeeModal;
