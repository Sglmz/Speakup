import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '../../../config';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

const TranslateWordGame = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, username, categoria, gameId } = route.params ?? {};

  const sentences = [
    { original: 'Mi casa es bonita', translation: ['my', 'house', 'is', 'beautiful'] },
    { original: 'La sala es grande', translation: ['the', 'living', 'room', 'is', 'big'] },
    { original: 'La cocina es moderna', translation: ['the', 'kitchen', 'is', 'modern'] }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    generateShuffled();
    generateStars();
  }, [currentIndex]);

  const generateShuffled = () => {
    const current = sentences[currentIndex].translation;
    const shuffled = [...current].sort(() => Math.random() - 0.5);
    setShuffled(shuffled);
    setSelected([]);
  };

  const generateStars = () => {
    const starData = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));
    starData.forEach(({ translateY, speed }) => {
      const anim = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: speed,
          useNativeDriver: true
        }).start(anim);
      };
      anim();
    });
    setStars(starData);
  };

  const handleSelect = (word) => {
    if (selected.includes(word)) return;
    const newSelected = [...selected, word];
    setSelected(newSelected);

    if (newSelected.length === sentences[currentIndex].translation.length) {
      const isCorrect = newSelected.join(' ') === sentences[currentIndex].translation.join(' ');
      setIsCorrect(isCorrect);
      setModalVisible(true);

      if (isCorrect && currentIndex === sentences.length - 1 && userId && gameId) {
        fetch(`${API_URL}guardar_progreso.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, game_id: gameId })
        })
          .then(res => res.json())
          .then(json => console.log("✔️ Progreso guardado:", json))
          .catch(err => console.error("❌ Error al guardar progreso:", err));
      }
    }
  };

  const handleNext = () => {
    setModalVisible(false);
    if (isCorrect) {
      if (currentIndex < sentences.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigation.replace('AllHouseGamesScreen', {
          userId,
          username,
          categoria
        }); // ✅ Evita regresar al juego
      }
    } else {
      setSelected([]);
    }
  };

  const currentSentence = sentences[currentIndex];

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.star, { left: s.x, transform: [{ translateY: s.translateY }] }]}>
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

      <Animatable.Text animation="fadeInDown" style={styles.question}>
        Traduce: "{currentSentence.original}"
      </Animatable.Text>

      <View style={styles.selectionContainer}>
        {selected.map((word, i) => (
          <View key={i} style={styles.selectedWord}>
            <Text style={styles.wordText}>{word}</Text>
          </View>
        ))}
      </View>

      <View style={styles.optionsContainer}>
        {shuffled.map((word, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.wordButton, selected.includes(word) && styles.disabled]}
            onPress={() => handleSelect(word)}
            disabled={selected.includes(word)}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="bounceIn"
            duration={500}
            style={[styles.modalContent, isCorrect ? styles.correct : styles.incorrect]}
          >
            <Text style={styles.modalText}>
              {isCorrect ? '✅ ¡Correcto!' : '❌ Intenta de nuevo'}
            </Text>
            <TouchableOpacity onPress={handleNext} style={styles.modalButton}>
              <Text style={styles.buttonText}>{isCorrect ? 'Siguiente' : 'Reintentar'}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default TranslateWordGame;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', paddingTop: 40 },
  star: { position: 'absolute' },
  question: { fontSize: 24, fontWeight: 'bold', color: '#4E342E', marginBottom: 20, textAlign: 'center', fontFamily: 'Comic Sans MS' },
  selectionContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  selectedWord: { backgroundColor: '#FFF176', borderRadius: 16, padding: 10, margin: 5 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  wordButton: { backgroundColor: '#FFD54F', borderRadius: 16, padding: 10, margin: 5 },
  disabled: { opacity: 0.5 },
  wordText: { fontSize: 18, color: '#4E342E', fontWeight: 'bold', fontFamily: 'Comic Sans MS' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 32, borderRadius: 24, alignItems: 'center', width: 280 },
  correct: { borderColor: '#13c26e', borderWidth: 2 },
  incorrect: { borderColor: '#c21b13', borderWidth: 2 },
  modalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 14, color: '#333', textAlign: 'center', fontFamily: 'Comic Sans MS' },
  modalButton: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  buttonText: { color: '#8d6200', fontWeight: 'bold', fontSize: 18, fontFamily: 'Comic Sans MS' }
});
