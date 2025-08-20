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
import AllGamesScreen from './screens/games/Animals/AllGamesScreen';
import AllGamesScreenNumbers from './screens/games/Numbers/AllGamesScreenNumbers';
import UserPanelScreen from './screens/UserPanelScreen';
import AnimalGameIntroScreen from './screens/games/Animals/AnimalGameIntroScreen';
import AnimalGameScreen from './screens/games/Animals/AnimalScreen';
import AnimalScreen2 from './screens/games/Colors/AnimalScreen2';
import ListenAndChooseScreen from './screens/games/Animals/ListenAndChooseScreen';
import AdminPanelScreen from './screens/AdminPanel';
import NumberGameIntroScreen from './screens/games/Numbers/NumberGameIntroScreen';
import ColorGameIntro from './screens/games/Colors/ColorGameIntroScreen';
import AllGamesScreenColors from './screens/games/Colors/AllGamesScreenColors';
import WordsGameIntro from './screens/games/words/WordsGameIntroScreen';
import AllWordsScreen from './screens/games/words/AllWordsScreen'; // 👈 aquí está
import AllLettersScreen from './screens/games/Letters/AllLettersScreen';
import LettersGameIntro from './screens/games/Letters/LettersGameIntroScreen';
import SpellWordScreen from './screens/games/words/WordGame1';
import CountTapGameScreen from './screens/games/Numbers/CountTapGameScreen';
import AllGamesScreenHouse from './screens/games/house/AllGamesScreenHouse';
import HouseGameIntroScreen from './screens/games/house/HouseGameIntroScreen';
import TranslateWordGame from './screens/games/house/OrderSentenceGame';

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
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />

        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={({ route, navigation }) => ({
            headerTitle: () => (
              <HeaderTitle text={`¡Hii ${route?.params?.username || 'usuario'}!`} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserPanel', {
                    username: route?.params?.username,
                    userId: route?.params?.userId
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

        <Stack.Screen name="Todas" component={AllCategoriesScreen} options={{ headerTitle: () => <HeaderTitle text="Categorías" /> }} />
        <Stack.Screen name="AllGamesScreen" component={AllGamesScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos" /> }} />
        <Stack.Screen name="AllGamesScreenNumbers" component={AllGamesScreenNumbers} options={{ headerTitle: () => <HeaderTitle text="Juegos de Números" /> }} />
        <Stack.Screen name="AllGamesScreenColors" component={AllGamesScreenColors} options={{ headerTitle: () => <HeaderTitle text="Juegos de Colores" /> }} />
        <Stack.Screen name="ColorGameIntro" component={ColorGameIntro} options={{ headerTitle: () => <HeaderTitle text="Colores" /> }} />
        <Stack.Screen name="AllWordsScreen" component={AllWordsScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos de Palabras" /> }} />
        <Stack.Screen name="WordsGameIntroScreen" component={WordsGameIntro} options={{ headerTitle: () => <HeaderTitle text="Palabras" /> }} />
        <Stack.Screen name="AllLettersScreen" component={AllLettersScreen} options={{ headerTitle: () => <HeaderTitle text="Juegos de Letras" /> }} />
        <Stack.Screen name="LettersGameIntro" component={LettersGameIntro} options={{ headerTitle: () => <HeaderTitle text="Intro Letras" /> }} />
        <Stack.Screen name="WordGame1" component={SpellWordScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de Palabras" /> }} />
        <Stack.Screen name="NumberGame1" component={CountTapGameScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de contar" /> }} />
        <Stack.Screen name="AllHouseGamesScreen" component={AllGamesScreenHouse} options={{ headerTitle: () => <HeaderTitle text="Juego sobre tu casa" /> }} />
        <Stack.Screen name="HouseGameIntro" component={HouseGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Intro Casa" /> }} />
        <Stack.Screen name="OrderSentence" component={TranslateWordGame} options={{ headerTitle: () => <HeaderTitle text="Ordenar Oraciones" /> }} />
        <Stack.Screen name="UserPanel" component={UserPanelScreen} options={{ headerTitle: () => <HeaderTitle text="Panel de Usuario" /> }} />
        <Stack.Screen name="AnimalGameIntro" component={AnimalGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Animales" /> }} />
        <Stack.Screen name="NumberGameIntro" component={NumberGameIntroScreen} options={{ headerTitle: () => <HeaderTitle text="Números" /> }} />
        <Stack.Screen name="AnimalGameScreen" component={AnimalGameScreen} options={{ headerTitle: () => <HeaderTitle text="Juego de Animales" /> }} />
        <Stack.Screen name="AnimalScreen2" component={AnimalScreen2} options={{ headerTitle: () => <HeaderTitle text="Juego de Animales 2" /> }} />
        <Stack.Screen name="ListenAndChooseScreen" component={ListenAndChooseScreen} options={{ headerTitle: () => <HeaderTitle text="Escuchar y Elegir" /> }} />
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
    backgroundColor: 'transparent', // O el mismo fondo que uses
    borderBottomWidth: 0,           // 🔥 Elimina línea inferior
    shadowColor: 'transparent',     // 🔥 Elimina sombra (iOS)
    elevation: 0,                   // 🔥 Elimina sombra (Android)
    zIndex: 1,
  },
  dynamicIslandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63', // O el color que usas para "Iniciar Sesión"
    textAlign: 'center',
    fontFamily: 'System',
  },
});
