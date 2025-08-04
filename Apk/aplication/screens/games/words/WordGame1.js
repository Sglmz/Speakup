import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function SpellWordScreen() {
  const target = 'DOG';
  const [progress, setProgress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const shakeRefs = useRef({});
  const letters = ['D', 'O', 'G', 'A'];

  // Fondo animado
  const [stars, setStars] = useState([]);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

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

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffa94d', '#ff9b31ff'],
  });

  const handleLetter = (letter) => {
    const expected = target[progress.length];
    if (letter === expected) {
      const next = progress + letter;
      setProgress(next);
      if (next.length === target.length) {
        setModalVisible(true);
      }
    } else {
      const ref = shakeRefs.current[letter];
      if (ref) ref.shake(800);
    }
  };

  const handleRestart = () => {
    setProgress('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Fondo de estrellas */}
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

      {/* Título con fondo brillante */}
      <Animated.Text style={[styles.title, { backgroundColor: glowColor }]}>
        ¡Deletrea la palabra según el animal!
      </Animated.Text>
<Image
  source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/042/654/471/small_2x/ai-generated-energetic-speckled-dog-leaping-in-the-air-free-png.png' }}
  style={styles.image}
/>

      {/* Guiones */}
      <View style={styles.blanksContainer}>
        {target.split('').map((_, i) => (
          <View key={i} style={styles.blank}>
            <Text style={styles.blankText}>{progress[i] || '_'}</Text>
          </View>
        ))}
      </View>

      {/* Letras */}
      <View style={styles.lettersContainer}>
        {letters.map((letter, idx) => (
          <Animatable.View
            key={idx}
            ref={ref => (shakeRefs.current[letter] = ref)}
          >
            <TouchableOpacity
              style={styles.letterBtn}
              onPress={() => handleLetter(letter)}
              disabled={modalVisible}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Modal de éxito */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={500} style={[styles.popup, styles.correct]}>
            <Text style={styles.modalTitle}>¡Excelente!</Text>
            <TouchableOpacity style={styles.btn} onPress={handleRestart}>
              <Text style={styles.btnText}>Jugar otra vez</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos unificados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    paddingTop: 40,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4f2c04',
    textAlign: 'center',
    padding: 12,
    borderRadius: 14,
    fontFamily: 'Comic Sans MS',
    marginBottom: 20,
    marginHorizontal: 20,
    elevation: 3,
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginBottom: 20,
  },
  blanksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  blank: {
    borderBottomWidth: 3,
    borderColor: '#333',
    width: 50,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  blankText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  letterBtn: {
    backgroundColor: '#FFD54F',
    width: (width - 100) / 4,
    paddingVertical: 16,
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e342e',
    fontFamily: 'Comic Sans MS',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 26,
    alignItems: 'center',
    width: 300,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#13c26e',
    fontFamily: 'Comic Sans MS',
  },
  btn: {
    backgroundColor: '#ffe57f',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  btnText: {
    color: '#8d6200',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
  correct: {
    borderWidth: 2,
    borderColor: '#13c26e',
  },
});
