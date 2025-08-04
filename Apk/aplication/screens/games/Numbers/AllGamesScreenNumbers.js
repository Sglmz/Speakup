import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../../../components/CategoryCard';
import AnimatedBackground from '../../../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllWordsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const categoria = route?.params?.categoria ?? null;

  return (
  <View style={styles.container} key={route?.key}>
    <AnimatedBackground style={styles.animatedBackground} />

    <ScrollView
      style={{ flex: 1, paddingTop: insets.top }}
      contentContainerStyle={styles.scroll}
    >
      <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
        ¡Escoje un juego y diviertete aprendiendo!
      </Animatable.Text>

      <View style={styles.grid}>
        {categoria === 'numeros' ? (
          <>
            <CategoryCard
              title="Count"
              description="Count from 1 to 10"
              sub="Cuenta del 1 al 10"
              color="#FFD54F"
              delay={100}
              onPress={() => navigation.navigate('NumberGame1')}
            />
            <CategoryCard
              title="Add"
              description="Add small numbers"
              sub="Suma números pequeños"
              color="#FBC02D"
              delay={300}
            />
            <CategoryCard
              title="Sort"
              description="Sort the numbers"
              sub="Ordena los números"
              color="#FFF176"
              delay={500}
            />
          </>
        ) : null}
      </View>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
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
    color: '#FF4081',
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
