import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

// Diccionario de números en inglés
const numberWords = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

export default function CountTapGameScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState([]);

  const glowAnim = useRef(new Animated.Value(0)).current;

  // Animación glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffeb3b', '#ffd54f'],
  });

  // Estrellas animadas
  useEffect(() => {
    const generatedStars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
    }));

    generatedStars.forEach(({ translateY, speed }) => {
      const animate = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: speed,
          useNativeDriver: true,
        }).start(animate);
      };
      animate();
    });

    setStars(generatedStars);
  }, []);

  // Pregunta
  const correctAnswer = 5;
  const options = [3, 5, 7, 9];

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    if (selected === null) {
      setSelected(option);
      setTimeout(() => handleAnswer(option === correctAnswer), 500);
    }
  };

  // ✅ Aquí corregimos la navegación usando navigate
  const handleContinue = () => {
    setModalVisible(false);
    if (isCorrect) {
      navigation.navigate('AllGamesScreenNumbers', { categoria: 'numeros' });
    } else {
      setSelected(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Estrellas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((star, i) => (
          <Animated.View
            key={i}
            style={[styles.star, { left: star.x, transform: [{ translateY: star.translateY }] }]}
          >
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon
                points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                fill="#FFF59D"
                opacity={0.3 + Math.random() * 0.7}
              />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <Animated.Text style={[styles.question, { backgroundColor: glowColor }]}>
        ¿Cuántas manzanas hay?
      </Animated.Text>

      {/* Mostrar las manzanas */}
      <View style={styles.imageContainer}>
        {[...Array(correctAnswer)].map((_, idx) => (
          <Image
            key={idx}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg' }}
            style={styles.apple}
          />
        ))}
      </View>

      {/* Opciones en inglés */}
      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          const animationType = isSelected
            ? opt === correctAnswer
              ? 'tada'
              : 'shake'
            : 'fadeInUp';

          return (
            <Animatable.View animation={animationType} delay={300 + idx * 100} key={opt} style={{ width: '48%' }}>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  isSelected && (opt === correctAnswer ? styles.correct : styles.incorrect),
                ]}
                onPress={() => handleOptionSelect(opt)}
                disabled={selected !== null}
              >
                <Text style={styles.optionText}>{numberWords[opt]}</Text>
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </View>

      {/* Modal resultado */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={[styles.popup, isCorrect ? styles.correct : styles.incorrect]}
          >
            <Text style={styles.msg}>
              {isCorrect ? '✅ Correct!' : '❌ Try again'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleContinue}>
              <Text style={styles.btnText}>
                {isCorrect ? 'Continue' : 'Retry'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', paddingTop: 40 },
  star: { position: 'absolute' },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f2c04',
    padding: 12,
    borderRadius: 14,
    textAlign: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  apple: { width: 60, height: 60, margin: 5, borderRadius: 10 },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
  },
  optionBtn: {
    backgroundColor: '#FFD54F',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  optionText: { fontSize: 18, fontWeight: 'bold', color: '#4e342e', textTransform: 'capitalize' },
  correct: { backgroundColor: '#B6FCD5', borderWidth: 2, borderColor: '#13c26e' },
  incorrect: { backgroundColor: '#ffb3b3', borderWidth: 2, borderColor: '#c21b13' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.21)', alignItems: 'center', justifyContent: 'center' },
  popup: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 26,
    alignItems: 'center',
    width: 300,
    elevation: 10,
  },
  msg: { fontSize: 20, fontWeight: 'bold', marginBottom: 14, color: '#333', textAlign: 'center' },
  btn: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 },
  btnText: { color: '#8d6200', fontWeight: 'bold', fontSize: 18 },
});
