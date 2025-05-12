import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../components/CategoryCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllCategoriesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Fondo animado detrás de todo */}
      <AnimatedBackground style={styles.animatedBackground} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={styles.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¡Explora todas las categorías!
        </Animatable.Text>

        <View style={styles.grid}>
          <CategoryCard title="Hogar" description="Aprende sobre tu casa" sub="Learn about your house" color="#FFC3A0" delay={100} />
          <CategoryCard title="Libros" description="Aprende sobre lectura" sub="Learn about reading" color="#C3FFD9" delay={200} />
          <CategoryCard title="Deportes" description="Aprende sobre deportes" sub="Learn about sports" color="#A0C4FF" delay={300} />
          <CategoryCard title="Juguetes" description="Aprende sobre juguetes" sub="Learn about toys" color="#FFB3C1" delay={400} />
          <CategoryCard title="Comida" description="Aprende sobre comida" sub="Learn about food" color="#FFD700" delay={500} />
          <CategoryCard title="Viajes" description="Aprende sobre viajes" sub="Learn about travel" color="#90EE90" delay={600} />
          <CategoryCard title="Clima" description="Aprende sobre el clima" sub="Learn about weather" color="#ADD8E6" delay={700} />
          <CategoryCard title="Trabajo" description="Aprende sobre profesiones" sub="Learn about professions" color="#FF6347" delay={800} />
          <CategoryCard title="Familia" description="Aprende sobre la familia" sub="Learn about family" color="#FFDAB9" delay={900} />
          <CategoryCard title="Tecnología" description="Aprende sobre tecnología" sub="Learn about technology" color="#98FB98" delay={1000} />
          <CategoryCard title="Ropa" description="Aprende sobre ropa" sub="Learn about clothing" color="#D3D3D3" delay={1100} />
          <CategoryCard title="Arte" description="Aprende sobre arte" sub="Learn about art" color="#FF8C00" delay={1200} />
          <CategoryCard title="Música" description="Aprende sobre música" sub="Learn about music" color="#8A2BE2" delay={1300} />
          <CategoryCard title="Naturaleza" description="Aprende sobre naturaleza" sub="Learn about nature" color="#32CD32" delay={1400} />
          <CategoryCard title="Cine" description="Aprende sobre cine" sub="Learn about cinema" color="#FF4500" delay={1500} />
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
    zIndex: -1, // fondo detrás de todo
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
