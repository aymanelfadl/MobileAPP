import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState(null);

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
  }, []);

  const handleLaunchCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setAvatar({ uri: response.assets[0].uri });
      }
    });
  };

  const handleLaunchImageLibrary = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setAvatar({ uri: response.assets[0].uri });
      }
    });
  };

  const handleUploadImage = async () => {
    try {
      if (!avatar) {
        console.log('No image selected');
        return;
      }

      const imageName = 'employee_' + Date.now();
      const reference = storage().ref(imageName);

      await reference.putFile(avatar.uri);
      const imageUrl = await reference.getDownloadURL();

      const employeeRef = await firestore().collection('employees').add({
        type: 'employee',
        thumbnail: imageUrl,
        description: name + ' ' + lastName,
        spends: 0,
        dateAdded: new Date().toISOString().slice(0, 10),
      });


      await firestore().collection('changeLogs').add({
        timestamp: new Date(),
        operation: 'A new employee, '+ name + ' ' + lastName +' has been added',
        employeeId: employeeRef.id,
      });

      console.log('Image uploaded successfully:', imageUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
          {avatar && <Image source={avatar} style={styles.avatar} />}
          <TouchableOpacity style={[styles.btn, styles.takePhotoBtn]} onPress={handleLaunchCamera}>
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.takePhotoBtn]} onPress={handleLaunchImageLibrary}>
            <Text style={styles.btnText}>Choose from Library</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="black"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholderTextColor="black"
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={handleUploadImage}>
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
    borderColor: '#262626',
    backgroundColor: "#FFF",
    borderRadius: 15,
    color: "#000",
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
    backgroundColor: "#0066cc", 
    marginBottom: 10,
  },
});

export default EmployeeModal;
