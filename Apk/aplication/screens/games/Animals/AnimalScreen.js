import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import GameQuestion from '../GameQuestion1';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

// Diccionario de traducciones
const optionMeanings = {
  Dog: 'Perro',
  Pineapple: 'Piña',
  Orange: 'Naranja',
  Book: 'Libro',
};

export default function AnimalGameScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState([]);

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

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    setSelected(option);
  };

  const handleContinue = () => {
    setModalVisible(false);
    if (isCorrect) {
      navigation.replace('AnimalScreen2');
    } else {
      setSelected('');
    }
  };

  return (
    <View style={styles.container} key={route?.key}>
      {/* Fondo animado con estrellas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((star, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                left: star.x,
                transform: [{ translateY: star.translateY }],
              },
            ]}
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

      <GameQuestion
        question="¿Cómo se llama este animal?"
        image={require('../../../assets/dog.gif')}
        options={['Dog', 'Pineapple', 'Orange', 'Book']}
        correctAnswer="Dog"
        onAnswer={handleAnswer}
        onSelect={handleOptionSelect}
        bgColor="transparent"
        selected={selected}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={[
              styles.popup,
              isCorrect ? styles.correct : styles.incorrect,
            ]}
          >
            <Text style={styles.wordSelected}>
              {selected
                ? `${selected} significa ${optionMeanings[selected] || '---'}`
                : ''}
            </Text>
            <Text style={styles.msg}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto, intenta de nuevo'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleContinue}>
              <Text style={styles.btnText}>
                {isCorrect ? 'Continuar' : 'Reintentar'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.21)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 26,
    alignItems: 'center',
    width: 300,
    elevation: 10,
    shadowColor: '#222',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  correct: {
    backgroundColor: '#C8F7C5',
    borderColor: '#13c26e',
    borderWidth: 3,
  },
  incorrect: {
    backgroundColor: '#ffb3b3',
    borderColor: '#c21b13',
    borderWidth: 3,
  },
  wordSelected: {
    fontSize: 24,
    color: '#ff8c00',
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  msg: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#333',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#ffe57f',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 5,
  },
  btnText: {
    color: '#8d6200',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
