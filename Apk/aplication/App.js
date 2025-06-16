import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AuthChoiceScreen from './screens/AuthChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AllCategoriesScreen from './screens/AllCategoriesScreen';
import UserPanelScreen from './screens/UserPanelScreen';
import AnimalGameIntroScreen from './screens/games/Animals/AnimalGameIntroScreen';
import AnimalGameScreen from './screens/games/Animals/AnimalScreen';
import AnimalScreen2 from './screens/games/Animals/AnimalScreen2'; // <--- NUEVO IMPORT

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
          options={({ navigation }) => ({
            headerTitle: () => (
              <HeaderTitle text="¡Bienvenido usuario!" />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('UserPanel')}
                style={{ marginRight: 18 }}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Icon name="account-circle" size={34} color="#FFAB00" />
              </TouchableOpacity>
            ),
          })}
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
        <Stack.Screen
          name="UserPanel"
          component={UserPanelScreen}
          options={{
            headerTitle: () => (
              <HeaderTitle text="Panel de Usuario" />
            ),
          }}
        />
        {/* Pantalla de introducción antes del juego */}
        <Stack.Screen
          name="AnimalGameIntro"
          component={AnimalGameIntroScreen}
          options={{
            headerTitle: () => (
              <HeaderTitle text="Animales" />
            ),
          }}
        />
        {/* Pantalla del juego principal */}
        <Stack.Screen
          name="AnimalGame"
          component={AnimalGameScreen}
          options={{
            headerTitle: () => (
              <HeaderTitle text="Juego de Animales" />
            ),
          }}
        />
        {/* Segunda pantalla del juego de animales */}
        <Stack.Screen
          name="AnimalScreen2"
          component={AnimalScreen2}
          options={{
            headerTitle: () => (
              <HeaderTitle text="Juego de Animales 2" />
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
