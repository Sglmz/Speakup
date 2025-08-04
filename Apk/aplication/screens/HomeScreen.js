import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AnimatedBackground from '../components/AnimatedBackground';
import CategoryCard from '../components/CategoryCard';

const categories = [
  { title: '1 2 3', description: 'Learn the numbers', sub: 'Aprende los números', color: '#FFD54F' },
  { title: 'ABC', description: 'Learn the letters', sub: 'Aprende las letras', color: '#FF8A65' },
  { title: 'HELLO!', description: 'Learn words', sub: 'Aprende palabras', color: '#F48FB1' },
  { title: 'Colors', description: 'Learn the colors', sub: 'Aprende los colores', color: '#A1887F' },
  { title: 'Animals', description: 'Learn the animals', sub: 'Aprende los animales', color: '#81C784' },
];

export default function HomeScreen({ navigation, route }) {
  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animatable.Text animation="bounceInDown" delay={200} style={styles.logo}>
          <Text style={styles.s}>S</Text>
          <Text style={styles.p}>P</Text>
          <Text style={styles.e}>E</Text>
          <Text style={styles.a}>A</Text>
          <Text style={styles.k}>K</Text>
          <Text style={styles.u}>U</Text>
          <Text style={styles.p2}>P</Text>
        </Animatable.Text>

        <Animatable.Text animation="fadeIn" delay={600} style={styles.level}>
          Nivel actual: <Text style={styles.inicial}>Inicial</Text>
        </Animatable.Text>

        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <CategoryCard
              key={i}
              delay={800 + i * 200}
              title={cat.title}
              description={cat.description}
              sub={cat.sub}
              color={cat.color}
              onPress={() => {
                if (cat.title === 'Animals') {
                  navigation.navigate('AnimalGameIntro', { progress: 0 });
                } else if (cat.title === '1 2 3') {
                  navigation.navigate('NumberGameIntro', { progress: 0 });
                } else if (cat.title === 'ABC') {
                  navigation.navigate('LettersGameIntro', { progress: 0 });
                } else if (cat.title === 'HELLO!') {
                  navigation.navigate('WordsGameIntroScreen', { progress: 0 });
                } else if (cat.title === 'Colors') {
                  navigation.navigate('ColorGameIntro', { progress: 0 });
                }
              }}
            />
          ))}
        </View>

        <Animatable.View animation="fadeInUp" delay={600}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Todas')}>
            <Text style={styles.buttonText}>Ver todas las categorías</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  scroll: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 100,
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    flexDirection: 'row',
    fontFamily: 'Comic Sans MS',
  },
  s: { color: '#ffab00', fontSize: 60 },
  p: { color: '#ffab00', fontSize: 60 },
  e: { color: '#ff3d00', fontSize: 60 },
  a: { color: '#2962ff', fontSize: 60 },
  k: { color: '#ffffff', fontSize: 60 },
  u: { color: '#ffab00', fontSize: 60 },
  p2: { color: '#ffab00', fontSize: 60 },
  level: {
    fontSize: 18,
    marginVertical: 0,
    fontFamily: 'Comic Sans MS',
  },
  inicial: {
    fontWeight: 'bold',
    color: '#455A64',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#3F51B5',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Comic Sans MS',
  },
  userPanelButton: {
    backgroundColor: '#FFAB00',
    marginTop: 15,
  },
  userPanelButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },
});
