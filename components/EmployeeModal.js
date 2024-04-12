import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const defaultPicture = require('../images/digital-nomad-35.png');

const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState(defaultPicture);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera and storage permissions granted');
      } else {
        console.log('One or more permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, [])

  const handleLaunchCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        if (response) {
          setAvatar(response.assets[0]);
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
        if (response) {
          setAvatar(response.assets[0]);
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
          <Text style={styles.title}>New Employee</Text>
          <Image source={avatar} style={styles.avatar} />
          <TouchableOpacity style={[styles.btn, styles.takePhotoBtn]} onPress={handleLaunchCamera}>
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.takePhotoBtn]} onPress={handleLaunchImageLibrary}>
            <Text style={styles.btnText}>Choose from Library</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={handleSubmit}>
            <Text style={styles.btnText}>Add Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    padding: 40,
    borderRadius: 10,
    elevation: 5,
    width: '80%'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: -25,
    marginLeft: -10 ,
    textAlign: "left",
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "#e4e4e4",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: "#262626",
    padding: 8,
    borderRadius: 100,
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 100,
    marginBottom: 10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addEmployeeBtn: {
    backgroundColor: "#0066cc", // Blue color
    marginBottom: 10,
  },
});

export default EmployeeModal;
