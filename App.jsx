import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './screens/HomePage';
import NotificationScreen from './screens/NotificationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const App = () => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
  
      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
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
  },[]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={({ navigation }) => ({
            title: 'Home',
            headerShown: true,
            headerRight: () => (
              <Icon
                name='bell'
                style={{ marginRight: 15, fontSize: 20, color: '#000' }}
                onPress={() => navigation.navigate('NotificationScreen')}
              />
            ),
          })}
        />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
