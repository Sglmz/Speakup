import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

// Datos del juego (colores y sus pares)
const colors = [
  { id: '1', value: 'RED', type: 'text', pairId: 'red' },
  { id: '2', value: 'red', type: 'color', pairId: 'red' },
  { id: '3', value: 'BLUE', type: 'text', pairId: 'blue' },
  { id: '4', value: 'blue', type: 'color', pairId: 'blue' },
  { id: '5', value: 'GREEN', type: 'text', pairId: 'green' },
  { id: '6', value: 'green', type: 'color', pairId: 'green' },
  { id: '7', value: 'YELLOW', type: 'text', pairId: 'yellow' },
  { id: '8', value: 'yellow', type: 'color', pairId: 'yellow' },
];

// Traducciones para feedback
const colorTranslations = {
  red: 'rojo',
  blue: 'azul',
  green: 'verde',
  yellow: 'amarillo',
};

// Mezclar cartas aleatoriamente
function shuffleArray(array) {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
}

export default function AnimalScreen2() {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [stars, setStars] = useState([]);

  // Glow animación para el título
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
    outputRange: ['#ffa94d', '#fff59d'],
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
    setShuffledCards(shuffleArray(colors));
  }, []);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      const isCorrect = first.pairId === second.pairId && first.type !== second.type;

      setTimeout(() => {
        setLastResult(isCorrect);
        setModalVisible(true);
        if (isCorrect) {
          setMatchedIds((prev) => [...prev, first.id, second.id]);
        }
        setSelectedCards([]);
      }, 600);
    }
  }, [selectedCards]);

  const handlePress = (card) => {
    if (
      selectedCards.length < 2 &&
      !selectedCards.some((c) => c.id === card.id) &&
      !matchedIds.includes(card.id)
    ) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (matchedIds.length === colors.length) {
      setTimeout(() => {
        Alert.alert('🎉 ¡Juego completado!', 'Has emparejado todas las tarjetas.');
      }, 300);
    }
  };

  const getTranslationMessage = () => {
    const textCard = selectedCards.find((c) => c.type === 'text');
    if (!textCard) return '';
    const translation = colorTranslations[textCard.pairId] || '---';
    return `¡Bien! ${textCard.value.toLowerCase()} significa ${translation}`;
  };

  // Esta función reemplaza GameQuestion
  const renderItem = ({ item }) => {
    const isMatched = matchedIds.includes(item.id);
    const isSelected = selectedCards.some((c) => c.id === item.id);
    const selectedAnimation = isSelected ? 'pulse' : 'bounceIn';
    const backgroundColor =
      item.type === 'color' ? item.value :
      isMatched ? 'rgba(182, 252, 213, 0.95)' :
      isSelected ? '#ffe082' : '#FFD54F';

    return (
      <Animatable.View
        animation={selectedAnimation}
        duration={600}
        iterationCount={isSelected ? 'infinite' : 1}
        style={{ width: '48%' }}
      >
        <TouchableOpacity
          onPress={() => handlePress(item)}
          disabled={isMatched}
          activeOpacity={0.85}
          style={[
            styles.optionBtn,
            { backgroundColor },
            isMatched && styles.correct,
            isSelected && styles.selected,
          ]}
        >
          {item.type === 'text' && (
            <Text style={[styles.optionText, { color: isMatched ? item.value.toLowerCase() : '#4e342e' }]}>
              {item.value}
            </Text>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Estrellas flotantes */}
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

      <Animated.Text style={[styles.title, { backgroundColor: glowColor }]}>
        Empareja el color con su nombre
      </Animated.Text>

      <FlatList
        data={shuffledCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      />

      {/* Modal de respuesta */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={[styles.popup, lastResult ? styles.correct : styles.incorrect]}
          >
            {lastResult && <Text style={styles.msg}>{getTranslationMessage()}</Text>}
            <Text style={styles.msg}>
              {lastResult
                ? '¡Correcto! 🎉'
                : 'Ups, esas no son pareja. Intenta de nuevo.'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleCloseModal}>
              <Text style={styles.btnText}>Continuar</Text>
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
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#4f2c04',
    fontFamily: 'Comic Sans MS',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 2,
    alignSelf: 'center',
  },
  optionBtn: {
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 25,
    height: 80,
    justifyContent: 'center',
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
  },
  correct: {
    shadowColor: '#13c26e',
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFB300',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
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
  incorrect: {
    backgroundColor: '#ffb3b3',
    borderColor: '#c21b13',
    borderWidth: 3,
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
