// AllCategoriesScreen.js
import React from 'react';
import { ScrollView, View, StyleSheet, Text, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import SketchCanvas from '../components/CanvaColor';  // <- importa tu componente
import AnimatedBackground from '../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllCategoriesScreen({ route }) {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={styles.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¡Explora todas las categorías!
        </Animatable.Text>

        {/* Aquí tu lienzo de pintura */}
        <SketchCanvas
          promptText="Pinta al niño comiendo de rojo"
          imageSource={require('../assets/canvas-img/eat.png')}
          width={screenWidth - 32}
          height={(screenWidth - 32) * 0.75}
        />

        {/* Tus CategoryCards debajo, si quieres */}
        <View style={styles.grid}>
          {/* ... tus CategoryCard */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  animatedBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1
  },
  scroll: { alignItems: 'center', paddingBottom: 100 },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#FF4081', marginBottom: 30,
    fontFamily: 'Comic Sans MS', textAlign: 'center', letterSpacing: 2,
    transform: [{ rotate: '-0.5deg' }],
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', marginHorizontal: 10,
  },
});
