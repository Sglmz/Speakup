import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Pantallas
import AuthChoiceScreen from './screens/AuthChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AllCategoriesScreen from './screens/AllCategoriesScreen';
import AllGamesScreen from './screens/games/Animals/AllGamesScreen';
import AllGamesScreenNumbers from './screens/games/Numbers/AllGamesScreenNumbers';
import AllGamesScreenColors from './screens/games/Colors/AllGamesScreenColors';
import AllGamesScreenHouse from './screens/games/house/AllGamesScreenHouse';

import UserPanelScreen from './screens/UserPanelScreen';
import AdminPanelScreen from './screens/AdminPanel';

import AnimalGameIntroScreen from './screens/games/Animals/AnimalGameIntroScreen';
import AnimalGameScreen from './screens/games/Animals/AnimalScreen';
import AnimalScreen2 from './screens/games/Colors/AnimalScreen2';
import ListenAndChooseScreen from './screens/games/Animals/ListenAndChooseScreen';

import NumberGameIntroScreen from './screens/games/Numbers/NumberGameIntroScreen';
import ColorGameIntro from './screens/games/Colors/ColorGameIntroScreen';
import HouseGameIntroScreen from './screens/games/house/HouseGameIntroScreen';

import WordsGameIntro from './screens/games/words/WordsGameIntroScreen';
import AllWordsScreen from './screens/games/words/AllWordsScreen';
import SpellWordScreen from './screens/games/words/WordGame1';

import AllLettersScreen from './screens/games/Letters/AllLettersScreen';
import LettersGameIntro from './screens/games/Letters/LettersGameIntroScreen';

import CountTapGameScreen from './screens/games/Numbers/CountTapGameScreen';
import TranslateWordGame from './screens/games/house/OrderSentenceGame';

// Juegos de casa
import HouseMemoryGame from './screens/games/house/HouseMemoryGame';
import HouseWhichRoomGame from './screens/games/house/HouseWhichRoomGame';
import HouseSpotItGame from './screens/games/house/HouseSpotItGame';

// Juegos de colores
import ColorsStroopGame from './screens/games/Colors/ColorsStroopGame';
import ColorsMixGame from './screens/games/Colors/ColorsMixGame';
import ColorsSimonGame from './screens/games/Colors/ColorsSimonGame';

// Juegos de números
import NumbersSumPickGame from './screens/games/Numbers/NumbersSumPickGame';
import NumbersCountGame from './screens/games/Numbers/NumbersCountGame';
import NumbersEvenOddGame from './screens/games/Numbers/NumbersEvenOddGame';

// Juegos de palabras
import WordsHangmanLiteGame from './screens/games/words/WordsHangmanLiteGame';
import WordsUnscrambleGame from './screens/games/words/WordsUnscrambleGame';
import WordsMissingLetterGame from './screens/games/words/WordsMissingLetterGame';

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
          headerStyle: { backgroundColor: '#FFEB3B', elevation: 0, shadowOpacity: 0 },
          headerTitleStyle: { fontFamily: 'Comic Sans MS', fontSize: 18, fontWeight: 'bold', color: '#FF4081' },
          headerTintColor: '#FF4081',
          headerTitleAlign: 'center',
        }}
      >
        {/* Auth */}
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />

        {/* Home */}
        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={({ route, navigation }) => ({
            headerTitle: () => <HeaderTitle text={`¡Hii ${route?.params?.username || 'usuario'}!`} />,
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserPanel', {
                    username: route?.params?.username,
                    userId: route?.params?.userId,
                  })
                }
                style={{ marginRight: 18 }}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Icon name="account-circle" size={34} color="#FFAB00" />
              </TouchableOpacity>
            ),
          })}
        />

        {/* Categorías */}
        <Stack.Screen name="Todas" component={AllCategoriesScreen} options={{ headerTitle: () => <HeaderTitle text="Categorías" /> }} />

        {/* Animales */}
        <Stack.Screen name="AllGamesScreen" component={AllGamesScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos" /> }} />
        <Stack.Screen name="AnimalGameIntro" component={AnimalGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Animales" /> }} />
        <Stack.Screen name="AnimalGameScreen" component={AnimalGameScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de Animales" /> }} />
        <Stack.Screen name="AnimalScreen2" component={AnimalScreen2} options={{ headerTitle: () => <HeaderTitle text="Juego de Animales 2" /> }} />
        <Stack.Screen name="ListenAndChooseScreen" component={ListenAndChooseScreen} options={{ headerTitle: () => <HeaderTitle text="Escuchar y Elegir" /> }} />

        {/* Juegos de Casa */}
        <Stack.Screen name="HouseMemoryGame" component={HouseMemoryGame} />
        <Stack.Screen name="HouseWhichRoomGame" component={HouseWhichRoomGame} />
        <Stack.Screen name="HouseSpotItGame" component={HouseSpotItGame} />

        {/* Juegos de Colores */}
        <Stack.Screen name="ColorsStroopGame" component={ColorsStroopGame} />
        <Stack.Screen name="ColorsMixGame" component={ColorsMixGame} />
        <Stack.Screen name="ColorsSimonGame" component={ColorsSimonGame} />

        {/* Juegos de Números */}
        <Stack.Screen name="NumbersSumPickGame" component={NumbersSumPickGame} />
        <Stack.Screen name="NumbersCountGame" component={NumbersCountGame} />
        <Stack.Screen name="NumbersEvenOddGame" component={NumbersEvenOddGame} />

        {/* Juegos de Palabras */}
        <Stack.Screen name="WordsHangmanLiteGame" component={WordsHangmanLiteGame} />
        <Stack.Screen name="WordsUnscrambleGame" component={WordsUnscrambleGame} />
        <Stack.Screen name="WordsMissingLetterGame" component={WordsMissingLetterGame} />

        {/* Números */}
        <Stack.Screen name="NumberGameIntro" component={NumberGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Números" /> }} />
        <Stack.Screen name="AllGamesScreenNumbers" component={AllGamesScreenNumbers} options={{ headerTitle: () => <HeaderTitle text="Juegos de Números" /> }} />
        <Stack.Screen name="CountTapGameScreen" component={CountTapGameScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de contar" /> }} />

        {/* Colores */}
        <Stack.Screen name="ColorGameIntro" component={ColorGameIntro} options={{ headerTitle: () => <HeaderTitle text="Colores" /> }} />
        <Stack.Screen name="AllGamesScreenColors" component={AllGamesScreenColors} options={{ headerTitle: () => <HeaderTitle text="Juegos de Colores" /> }} />

        {/* Casa */}
        <Stack.Screen name="HouseGameIntro" component={HouseGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Intro Casa" /> }} />
        <Stack.Screen name="AllHouseGamesScreen" component={AllGamesScreenHouse} options={{ headerTitle: () => <HeaderTitle text="Juego sobre tu casa" /> }} />
        <Stack.Screen name="OrderSentenceGame" component={TranslateWordGame} options={{ headerTitle: () => <HeaderTitle text="Ordenar Oraciones" /> }} />

        {/* Palabras y Letras */}
        <Stack.Screen name="WordsGameIntroScreen" component={WordsGameIntro} options={{ headerTitle: () => <HeaderTitle text="Palabras" /> }} />
        <Stack.Screen name="AllWordsScreen" component={AllWordsScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos de Palabras" /> }} />
        <Stack.Screen name="WordGame1" component={SpellWordScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de Palabras" /> }} />
        <Stack.Screen name="LettersGameIntro" component={LettersGameIntro} options={{ headerTitle: () => <HeaderTitle text="Intro Letras" /> }} />
        <Stack.Screen name="AllLettersScreen" component={AllLettersScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos de Letras" /> }} />

        {/* Usuarios y Admin */}
        <Stack.Screen name="UserPanel" component={UserPanelScreen} options={{ headerTitle: () => <HeaderTitle text="Panel de Usuario" /> }} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ headerTitle: () => <HeaderTitle text="Panel Admin" /> }} />
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
  dynamicIslandContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
    zIndex: 1,
  },
  dynamicIslandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
