import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ArticleModal = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  const handleLaunchCamera = () => {
    // Implement logic to launch camera and set thumbnail state
  };

  const handleLaunchImageLibrary = () => {
    // Implement logic to launch image library and set thumbnail state
  };

  const handleAddArticle = async () => {
    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadImage();

      // Add article data to Firestore
      await firestore().collection('itmesCollection').add({
        title: title,
        content: content,
        thumbnail: imageUrl,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const uploadImage = async () => {
    try {
      // Implement logic to upload image to Firebase Storage and return the download URL
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
          <Text style={styles.title}>New Article</Text>
          {thumbnail && <Image source={thumbnail} style={styles.thumbnail} />}
          <TouchableOpacity style={styles.btn} onPress={handleLaunchCamera}>
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleLaunchImageLibrary}>
            <Text style={styles.btnText}>Choose from Library</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Content"
            multiline={true}
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity style={styles.btn} onPress={handleAddArticle}>
            <Text style={styles.btnText}>Add Article</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#FFF',
    borderRadius: 15,
    color: '#000',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#262626',
    padding: 10,
    borderRadius: 100,
    marginBottom: 15,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ff0000',
    marginBottom: -10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
});

export default ArticleModal;
