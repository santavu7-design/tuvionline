import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './screens/WelcomeScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import { UserProvider } from './contexts/UserContext';
import { DatabaseProvider } from './contexts/DatabaseContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DatabaseProvider>
          <UserProvider>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Welcome"
                screenOptions={{
                  headerShown: false
                }}
              >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Main" component={MainTabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </UserProvider>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
