// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native'; 

// const Header = ({ title }) => {
//   const navigation = useNavigation(); 

//   const handleNotificationPress = () => {
//     navigation.navigate('NotificationScreen');
//   };
  
//   return (
//     <View style={styles.header}>
//       <Text style={styles.title}>{title}</Text>
//       <TouchableOpacity onPress={handleNotificationPress}>
//         <Icon name='bell' style={styles.icon} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   icon: {
//     fontSize: 18
//   }
// });

// export default Header;
