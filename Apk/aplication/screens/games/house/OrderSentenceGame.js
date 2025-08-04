import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function TranslateWordGame() {
  const questions = [
    {
      sentence: "She plays guitar in the",
      translation: "Ella toca guitarra en la sala",
      target: "LIVINGROOM",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQynKd7-nYOz9wFCSbAfPBPqikX2YvR-Bpf2A&s",
      letters: ["L", "V", "G", "O", "R", "O", "M", "I", "N"]
    },
    {
      sentence: "He cooks in the",
      translation: "Él cocina en la cocina",
      target: "KITCHEN",
      image: "https://img.freepik.com/premium-vector/kitchen-with-stove-oven-stove-window_1025542-70867.jpg",
      letters: ["O", "E", "C", "T", "H", "I", "N", "A", "K"]
    },
    {
      sentence: "I sleep in the",
      translation: "Yo duermo en el dormitorio",
      target: "BEDROOM",
      image: "https://t3.ftcdn.net/jpg/02/00/48/10/360_F_200481040_e36DewfQr2xDonN5IOQxGgFUsoZSqHiK.jpg",
      letters: ["B", "M", "D", "B", "O", "S", "E", "A"]
    },
  ];

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const shakeRef = useRef(null);

  // Estrellas animadas
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

  const q = questions[current];

  // ✅ Lógica corregida: solo agrega letras correctas
  const handleLetter = (letter) => {
    const expected = q.target[progress.length];
    if (letter === expected) {
      const next = progress + letter;
      setProgress(next);
      if (next.length === q.target.length) {
        setModalVisible(true);
      }
    } else {
      if (shakeRef.current) shakeRef.current.shake(800);
    }
  };

  const nextQuestion = () => {
    setModalVisible(false);
    setProgress("");
    setCurrent((prev) => (prev + 1) % questions.length);
  };

  return (
    <View style={styles.container}>
      {/* Fondo estrellas */}
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

      {/* Título */}
      <Animated.Text style={[styles.title, { backgroundColor: glowColor }]}>
        Ordenar Oraciones
      </Animated.Text>

      {/* Imagen */}
      <Image
        source={{ uri: q.image }}
        style={styles.image}
        resizeMode="cover"
        onError={() => console.log("Error cargando imagen")}
      />

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Traduce lo restante a inglés:</Text>
      <Text style={styles.sentence}>{q.sentence}</Text>
      <Text style={styles.translation}>{q.translation}</Text>

      {/* Guiones */}
      <View style={styles.blanksContainer}>
        {q.target.split("").map((_, i) => (
          <View key={i} style={styles.blank}>
            <Text style={styles.blankText}>{progress[i] || "_"}</Text>
          </View>
        ))}
      </View>

      {/* Letras */}
      <Animatable.View ref={shakeRef} style={styles.lettersContainer}>
        {q.letters.map((letter, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.letterBtn}
            onPress={() => handleLetter(letter)}
            disabled={modalVisible}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>

      {/* Modal de éxito */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={500} style={[styles.popup, styles.correct]}>
            <Text style={styles.modalTitle}>¡Excelente!</Text>
            <TouchableOpacity style={styles.btn} onPress={nextQuestion}>
              <Text style={styles.btnText}>Siguiente</Text>
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
    paddingTop: 20,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f2c04',
    textAlign: 'center',
    padding: 10,
    borderRadius: 14,
    fontFamily: 'Comic Sans MS',
    marginBottom: 10,
    marginHorizontal: 20,
    elevation: 3,
  },
  image: {
    width: 220,
    height: 180,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: 'Comic Sans MS',
    color: '#ff4081',
  },
  sentence: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5d4037',
    marginTop: 4,
    fontFamily: 'Comic Sans MS',
  },
  translation: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Comic Sans MS',
  },
  blanksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  blank: {
    borderBottomWidth: 3,
    borderColor: '#333',
    width: 32,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  blankText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 5,
  },
  letterBtn: {
    backgroundColor: '#FFD54F',
    width: (width - 120) / 6,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  letterText: {
    fontSize: 18,
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
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    width: 280,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#13c26e',
    fontFamily: 'Comic Sans MS',
  },
  btn: {
    backgroundColor: '#ffe57f',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
  },
  btnText: {
    color: '#8d6200',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Comic Sans MS',
  },
  correct: {
    borderWidth: 2,
    borderColor: '#13c26e',
  },
});
