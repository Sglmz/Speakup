import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../../../components/CategoryCard';
import AnimatedBackground from '../../../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllLettersScreen({ route }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={styles.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¡Escoje un juego y diviértete aprendiendo!
        </Animatable.Text>

        <View style={styles.grid}>
          <CategoryCard
            title="Find it"
            description="Tap the correct letter"
            sub="Toca la letra correcta"
            color="#4DB6AC"
            delay={100}
          />
          <CategoryCard
            title="Sounds"
            description="Match letters to sounds"
            sub="Empareja letras y sonidos"
            color="#81C784"
            delay={300}
          />
          <CategoryCard
            title="Alphabet"
            description="Put letters in order"
            sub="Ordena el abecedario"
            color="#BA68C8"
            delay={500}
          />
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
