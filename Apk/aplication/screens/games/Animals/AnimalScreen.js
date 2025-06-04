import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import GameQuestion from '../GameQuestion1';
import AnimatedBackground from '../../../components/AnimatedBackground';

export default function AnimalGameScreen(route) {
  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <GameQuestion
        question="¿Cómo se llama este animal?"
        image={require('../../../assets/dog.gif')}
        options={['Dog', 'Pineapple', 'Orange', 'Book']}
        correctAnswer="Dog"
        onAnswer={(isCorrect) => {
          Alert.alert(
            isCorrect ? '¡Correcto!' : 'Incorrecto',
            isCorrect ? '¡Muy bien!' : 'Intenta de nuevo'
          );
        }}
        bgColor="transparent" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
