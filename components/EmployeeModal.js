import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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
    checkInternetConnection();
    synchronizeDataWithFirestore();
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

  const checkInternetConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  };

  const handleAddEmployee = async () => {
    try {
      const imageUrl = await uploadImage();
      const employeeData = {
        name: name,
        lastName: lastName,
        avatar: imageUrl,
      };

      if (isConnected) {
        await uploadToFirebase(employeeData);
      } else {
        await saveLocally(employeeData);
      }


      onClose();
    } catch (error) {
      console.error('Error handling employee data:', error);
    }
  };

  const saveLocally = async (employeeData) => {
    try {
      await AsyncStorage.setItem('newEmployee', JSON.stringify(employeeData));
      onClose();
    } catch (error) {
      console.error('Error saving employee data locally:', error);
    }
  };

  const uploadImage = async () => {
    try {
      let imageUrl;
  
      if (!avatar) {
        imageUrl = 'https://firebasestorage.googleapis.com/v0/b/project-cb3df.appspot.com/o/digital-nomad-35.png?alt=media&token=c4e449b2-8c1e-4459-ab81-79ef199dcda3';
      } else {
        const imageName = 'employee_' + Date.now();
        const reference = storage().ref(imageName);
  
        await reference.putFile(avatar.uri);
        imageUrl = await reference.getDownloadURL();
      }
  
      return imageUrl; 
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const uploadToFirebase = async (employeeData) => {
    try {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();

      const formattedDate = `${day}/${month}/${year}`;

      const employeeRef = await firestore().collection('itemsCollection').add({
        type: 'employee',
        thumbnail: employeeData.avatar, 
        description: employeeData.name + ' ' + employeeData.lastName,
        spends: 0,
        dateAdded: formattedDate,
        timestamp: currentDate,
    });

  
      await firestore().collection('changeLogs').add({
        timestamp: new Date(),
        operation: 'A new employee, ' + employeeData.name + ' ' + employeeData.lastName + ' has been added',
        employeeId: employeeRef.id,
      });
      console.log("the employee has ben addeed ");
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const synchronizeDataWithFirestore = async () => {
    try {
      const localData = await AsyncStorage.getItem('newEmployee');
      if (localData) {
        const employeeData = JSON.parse(localData);
        console.log(employeeData);
        
        await uploadToFirebase(employeeData);
  
        await AsyncStorage.removeItem('newEmployee');
      }
    } catch (error) {
      console.error('Error synchronizing data with Firestore:', error);
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
          <TouchableOpacity style={[styles.btn, styles.addEmployeeBtn]} onPress={handleAddEmployee}>
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
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#ff0000",
    padding: 8,
    borderRadius: 100,
    marginBottom: -10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addEmployeeBtn: {
    backgroundColor: "#0066cc", 
    padding:10,
    marginBottom: 15,
  },
});

export default EmployeeModal;
