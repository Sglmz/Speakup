import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

import AuthChoiceScreen from './screens/AuthChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AllCategoriesScreen from './screens/AllCategoriesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthChoice"
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false, 
          headerBackTitle: '',           
          headerStyle: {
            backgroundColor: '#FFEB3B',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontFamily: 'Comic Sans MS',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FF4081',
          },
          headerTintColor: '#FF4081',
          headerTitleAlign: 'center',
        }}
      >
        {/* 🔻 Sin header solo en AuthChoice */}
        <Stack.Screen
          name="AuthChoice"
          component={AuthChoiceScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />

        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <HeaderTitle text="¡Bienvenido usuario!" />
            ),
          }}
        />

        <Stack.Screen
          name="Todas"
          component={AllCategoriesScreen}
          options={{
            headerTitle: () => (
              <HeaderTitle text="Categorías" />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HeaderTitle({ text }) {
  return (
    <View style={styles.dynamicIslandContainer}>
      <Animatable.Text animation="fadeIn" style={styles.dynamicIslandText}>
        {text}
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dynamicIslandText: {
    fontFamily: 'Comic Sans MS',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
  },
  dynamicIslandContainer: {
    marginTop: 5,
    marginHorizontal: 20,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    borderRadius: 20,
  },
});
