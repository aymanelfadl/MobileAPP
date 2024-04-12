import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './screens/HomePage';
import NotificationScreen from './screens/NotificationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const App = () => {
;

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
