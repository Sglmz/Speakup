import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GameQuestion({
  question = "¿Elije la opción correcta?",
  image,
  options = [],
  correctAnswer,
  onAnswer = () => {},
  bgColor = '#FFEB3B',
}) {
  const [selected, setSelected] = useState(null);

  const handlePress = (option) => {
    setSelected(option);
    setTimeout(() => onAnswer(option === correctAnswer), 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animatable.View animation="bounceInDown" duration={900}>
        <Text style={styles.question}>{question}</Text>
      </Animatable.View>

      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => (
          <Animatable.View
            animation="fadeInUp"
            delay={400 + idx * 100}
            key={opt}
            style={{ width: '48%' }}
          >
            <TouchableOpacity
              style={[
                styles.optionBtn,
                selected === opt && (opt === correctAnswer ? styles.correct : styles.incorrect),
                { backgroundColor: '#FFD54F' }
              ]}
              onPress={() => handlePress(opt)}
              disabled={selected !== null}
              activeOpacity={0.85}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
      
      <Animatable.Image
        animation="bounceIn"
        delay={200}
        source={image}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEB3B',
    borderRadius: 22,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f2c04',
    backgroundColor: '#ffa94d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    textAlign: 'center',
    fontFamily: 'Comic Sans MS',
    marginBottom: 26,
    elevation: 2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  optionBtn: {
    backgroundColor: '#FFD54F',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginVertical: 6,
    alignItems: 'center',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    marginTop: 25,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e342e',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
  },
  correct: {
    backgroundColor: '#B6FCD5',
    borderWidth: 2,
    borderColor: '#13c26e',
  },
  incorrect: {
    backgroundColor: '#ffb3b3',
    borderWidth: 2,
    borderColor: '#c21b13',
  },
  image: {
    width: 400,
    height: 400,
    marginTop: 0,
  },
});
