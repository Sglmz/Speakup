import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function ListenAndChooseScreen({ navigation }) {
  const [sound, setSound] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [stars, setStars] = useState([]);

  const options = [
    { id: 'dog', label: 'Dog', correct: true },
    { id: 'tree', label: 'Tree', correct: false },
    { id: 'pineapple', label: 'Pineapple', correct: false },
    { id: 'book', label: 'Book', correct: false },
  ];

  const glowAnim = useRef(new Animated.Value(0)).current;

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
    outputRange: ['#ffa94d', '#ff9b31ff'],
  });

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

    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/dog.wav')
      );
      setSound(sound);
    })();

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  const handlePlay = async () => {
    if (!sound) return;
    await sound.replayAsync();
  };

  const handleSelect = id => {
    const opt = options.find(o => o.id === id);
    const correct = opt?.correct === true;
    setIsCorrect(correct);
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleContinue = () => {
    setModalVisible(false);
    const wasCorrect = isCorrect;
    setSelectedId(null);
    setIsCorrect(false);

    if (wasCorrect) {
      navigation.replace('AnimalGameScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo animado */}
      <View style={StyleSheet.absoluteFill}>
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

      {/* Título animado */}
      <Animated.Text style={[styles.title, { backgroundColor: glowColor }]}>
        ESCUCHA Y ELIGE
      </Animated.Text>

      <Text style={styles.subtitle}>
        Presiona el ícono de sonido y luego selecciona la palabra correcta.
      </Text>

      <View style={styles.topRow}>
        <TouchableOpacity onPress={handlePlay} style={styles.speakerBtn}>
          <FontAwesome name="volume-up" size={50} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => handleSelect(opt.id)}
            disabled={!!selectedId}
            style={[
              styles.optionBtn,
              selectedId === opt.id && isCorrect && styles.correctBtn,
              selectedId === opt.id && !isCorrect && styles.incorrectBtn,
            ]}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal de feedback */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={[
              styles.modalBox,
              isCorrect ? styles.modalCorrect : styles.modalIncorrect,
            ]}
          >
            <Text style={styles.modalText}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleContinue}>
              <Text style={styles.nextText}>
                {isCorrect ? 'Continuar' : 'Reintentar'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    padding: 16,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginVertical: 20,
    color: '#4f2c04',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 2,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  speakerBtn: {
    padding: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBtn: {
    backgroundColor: '#FFD54F',
    width: (width - 64) / 2,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    color: '#4e342e',
  },
  correctBtn: {
    backgroundColor: '#C8F7C5',
    borderWidth: 2,
    borderColor: '#13c26e',
  },
  incorrectBtn: {
    backgroundColor: '#ffb3b3',
    borderWidth: 2,
    borderColor: '#c21b13',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.21)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: 280,
    elevation: 10,
    shadowColor: '#222',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalCorrect: {
    borderColor: '#13c26e',
    borderWidth: 3,
  },
  modalIncorrect: {
    borderColor: '#c21b13',
    borderWidth: 3,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#ffe57f',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  nextText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8d6200',
    fontFamily: 'Comic Sans MS',
  },
});
