import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as Páginas
import Login from './pages/login';
import Home from './pages/home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            title: 'Página Inicial',
            headerStyle: { backgroundColor: '#1e293b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        />
      </Stack.Navigator>

  );
}
