import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GameQuestion({
  question = "¿Elije la opción correcta?",
  image,
  options = [],
  correctAnswer,
  onAnswer = () => {},
  onSelect = () => {},
  selected,
  bgColor = '#FFEB3B',
}) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handlePress = (option) => {
    if (!selected) {
      onSelect(option);
      setTimeout(() => onAnswer(option === correctAnswer), 500);
    }
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffa94d', '#fff59d'],
  });

  const renderConfetti = () => {
    if (selected === correctAnswer) {
      return (
        <Animatable.Text
          animation="fadeInDown"
          iterationCount={1}
          duration={1200}
          style={styles.confetti}
        >
        </Animatable.Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.Text
        style={[
          styles.question,
          {
            backgroundColor: glowColor,
          },
        ]}
      >
        {question}
      </Animated.Text>

      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => {
          const isCorrect = opt === correctAnswer;
          const isSelected = selected === opt;
          const animationType = isSelected
            ? isCorrect
              ? 'tada'
              : 'shake'
            : 'fadeInUp';

          return (
            <Animatable.View
              animation={animationType}
              delay={400 + idx * 100}
              duration={800}
              key={opt}
              style={{ width: '48%' }}
            >
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  isSelected && (isCorrect ? styles.correct : styles.incorrect),
                ]}
                onPress={() => handlePress(opt)}
                disabled={!!selected}
                activeOpacity={0.85}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </View>

      <Animatable.Image
        animation="bounceIn"
        delay={200}
        source={image}
        style={styles.image}
        resizeMode="contain"
      />

      {renderConfetti()}
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
  confetti: {
    fontSize: 36,
    position: 'absolute',
    top: 50,
  },
});
