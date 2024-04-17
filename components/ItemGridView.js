import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TouchableWithoutFeedback,ActivityIndicator } from 'react-native';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import EmployeeModal from './EmployeeModal';
import ImageViewerModal from './ImageViewerModal';
import firestore from '@react-native-firebase/firestore';
import AddSpendModal from './AddSpendModal';
import ArticleModal from './ArticleModal';
import Sound from 'react-native-sound';
import AddSpendModalArticle from './AddSpendsModalArticle';
import ConfirmationModal from './ConfirmationModal';


const ItemGridView = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModificationAction , setShowModificationAction ] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selctedImageUri , setSelctedImageUri] = useState(null);
  const [loading , setLoading] = useState(true);
  const [isEmployeeModalVisible , setIsEmployeeModalVisible] = useState(false);
  const [isArticleModalVisible , setIsArticleModalVisible] = useState(false);
  const [isAudioPlaying , setIsAudioPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore().collection('itemsCollection').onSnapshot(snapshot => {
        const fetchedItems = [];
        snapshot.forEach(documentSnapshot => {
            const data = documentSnapshot.data();
            fetchedItems.push({
                id: documentSnapshot.id,
                ...data,
                timestamp: data.timestamp.toDate(), 
                isAudioPlaying: false, 
            });
        });
        fetchedItems.sort((a, b) => b.timestamp - a.timestamp); 
        setItems(fetchedItems);
        setLoading(false);
    }, error => {
        console.error('Error fetching data:', error);
        setLoading(false);
    });

    return () => unsubscribe();
}, [showOptions]);
  

  const handleItemLongPress = (item) => {
    setShowModificationAction(item);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteConfirmationModal(true);
  };

  const handleDeleteConfiramtion = async (item) => {
    try {
      await firestore().collection('itemsCollection').doc(item.id).delete();
      console.log('Item deleted successfully');

      await firestore().collection('changeLogs').add({
        itemId: item.id,
        timestamp : new Date(),
        operation: item.description +  ' has been deleted',
      })
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setDeleteConfirmationModal(false);
  };
  

  const handleCloseOptions = () => {
    setSelectedItem(null);
    setShowModificationAction(null);
    setShowOptions(false);
    setIsImageViewerVisible(false);
    setIsEmployeeModalVisible(false)
  };

  const handleItemPress = (item) => { 
    setShowModificationAction(false);
    if (item.type == 'article') {
      setSelectedItem(item);
      setIsArticleModalVisible(true);
    } else if (item.type === 'employee') {
        setSelectedItem(item);
        setIsEmployeeModalVisible(true);
    }
  }

  const picturePress = (item) => {
    setSelctedImageUri(item.thumbnail);
    setIsImageViewerVisible(true);
    console.log('has ben presed')
  }

  const toggleAudioState = (itemId) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, isAudioPlaying: !item.isAudioPlaying };
        }
        return item;
      });
    });
  };
  const playAudioFromURL = (url,itemId) => {
    const sound = new Sound(url, '', (error) => {
      if (error) {
        console.log('Error loading sound:', error);
      } else {
        setIsAudioPlaying(true);
        sound.play((success) => {
          if (success) {
            console.log('Audio played successfully');
            toggleAudioState(itemId);
            setIsAudioPlaying(false);
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      }
      toggleAudioState(itemId); 
    });
    setSound(sound);
  };
  
  const stopPlayingAudio = (itemId) => {
    setIsAudioPlaying(false);
    console.log("audio stopped");
    toggleAudioState(itemId);
    sound.stop();
  }
  
  const handleButtonPress = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPressArticle = () => {
    setShowArticleModal(true);
    setShowOptions(false);
  };

  const handleOptionPressEmployee = () => {
    setShowEmployeeModal(true);
    setShowOptions(false);
  }



  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleItemLongPress(item)}
    >
      <TouchableOpacity style={showModificationAction ? styles.editIconContainer : styles.hideEditIconContainer} onPress={() => handleEdit(item)}>
        <Icon name="file-edit-outline" size={20} style={{opacity:1 , color: "#000"}}  />
      </TouchableOpacity>
      <TouchableOpacity style={showModificationAction ? styles.deleteIconContainer : styles.hideDeleteIconContainer} onPress={() => handleDelete(item)}>
        <Icon name="delete-circle-outline" size={20} style={{opacity:1, color: "red"}} />
      </TouchableOpacity>
      {(item.thumbnailType === 'image' || item.type === 'employee') && (
        <TouchableOpacity onPress={()=> picturePress(item)}>  
          <Image source={{uri: item.thumbnail}} style={styles.thumbnail}  />
        </TouchableOpacity>
      )}
      {(item.thumbnailType ==='audio') && (
        <TouchableOpacity> 
         <View>
          {item.isAudioPlaying ? (
            <TouchableOpacity onPress={() => stopPlayingAudio(item.id)} style={styles.audioIconContainer}>
              <Text>
                <Icon name="stop" size={60} color="black" />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => playAudioFromURL(item.thumbnail, item.id)} style={styles.audioIconContainer}>
              <Text>
                <Icon name="play" size={60} color="black" />
              </Text>
            </TouchableOpacity>
          )}
        </View>
       </TouchableOpacity>
      )}
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.spends}>{item.spends} MAD</Text>
      <Text style={styles.dateAdded}>{item.dateAdded}</Text>
    </TouchableOpacity>
  );
  
  return (
    <TouchableWithoutFeedback onPress={handleCloseOptions}>
      {loading ? (
        <ActivityIndicator size="large" color="#000"/>
      ):(
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
         <ImageViewerModal
          visible={isImageViewerVisible}
          imageUri={selctedImageUri}
          onClose={() => setIsImageViewerVisible(false)}
        />  
         <ConfirmationModal
        visible={deleteConfirmationModal}
        onCancel={()=>{setDeleteConfirmationModal(false)}}
        onConfirm={() => handleDeleteConfiramtion(selectedItem)}
      />
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}><Icon name="plus" size={40} color="#fff" /></Text>
        </TouchableOpacity>
         <AddSpendModal onClose={()=> setIsEmployeeModalVisible(false)} employee={selectedItem} visible={isEmployeeModalVisible} />
         <AddSpendModalArticle onClose={()=> setIsArticleModalVisible(false)}  article={selectedItem} visible={isArticleModalVisible}/> 
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleOptionPressArticle}>
              <Text style={styles.optionText}><Icon name='book-plus-outline' size={35} color="#fff"></Icon></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleOptionPressEmployee}>
              <Text style={styles.optionText}><Icon name="account-plus-outline" size={35} color="#fff" ></Icon></Text>
            </TouchableOpacity>
          </View>
        )}
        {showEmployeeModal && (
          <EmployeeModal visible={showEmployeeModal} onClose={() =>setShowEmployeeModal(false)}/>
        )}{showArticleModal &&
          <ArticleModal visible={showArticleModal} onClose={() => setShowArticleModal(false)} /> 
        }
      </View>)}
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
    backgroundColor: "#FFF",
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
    backgroundColor:"#FFF",
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
    zIndex:100
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#000",
    marginBottom: 5,
  },
  spends: {
    color: "#000",
    fontSize: 14,
    marginBottom: 2,
  },
  dateAdded: {
    color: "#000",
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
    backgroundColor: '#262626',
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
    bottom: 90,
    right: 21,
  },
  option: {
    backgroundColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginVertical: 8
  },
  optionText: {
    color: '#fff',
    fontSize: 90,
  },
  audioIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  }
});
export default ItemGridView;
