import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../../../components/CategoryCard';
import AnimatedBackground from '../../../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AllFoodGamesScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={styles.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¡Elige un juego y aprende sobre alimentos de forma divertida!
        </Animatable.Text>

        <View style={styles.grid}>
          <CategoryCard
            title="Chef Word"
            description="Complete the food word"
            sub="Completa la palabra del alimento"
            color="#FFA726"
            delay={100}
            onPress={() => navigation.navigate('BuildFoodWord')}
          />
          <CategoryCard
            title="Food Match"
            description="Match the food"
            sub="Empareja la comida con su nombre"
            color="#66BB6A"
            delay={300}
            onPress={() => navigation.navigate('MatchFood')}
          />
          <CategoryCard
            title="Where's the Food?"
            description="Find the right dish"
            sub="Encuentra el platillo correcto"
            color="#29B6F6"
            delay={500}
            onPress={() => navigation.navigate('FindFood')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 30,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    letterSpacing: 2,
    transform: [{ rotate: '-0.5deg' }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
