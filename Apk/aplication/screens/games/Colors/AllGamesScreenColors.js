import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../../../components/CategoryCard';
import AnimatedBackground from '../../../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AllColorGamesScreen({ route }) {
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
          ¡Escoje un juego y diviértete aprendiendo!
        </Animatable.Text>

        <View style={styles.grid}>
          <CategoryCard
            title="Color Match"
            description="Match the colors"
            sub="Empareja los colores"
            color="#FF8A65"
            delay={100}
            onPress={() => navigation.navigate('AnimalScreen2')}
          />
          <CategoryCard
            title="Paint It!"
            description="Tap to paint objects"
            sub="Toca para pintar objetos"
            color="#BA68C8"
            delay={300}
            onPress={() => navigation.navigate('AnimalScreen2')}
          />
          <CategoryCard
            title="Name the Color"
            description="Learn color names"
            sub="Aprende los nombres"
            color="#4DB6AC"
            delay={500}
            onPress={() => navigation.navigate('AnimalScreen2')}
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
