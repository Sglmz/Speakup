import React, { useState, useRef, useEffect, useMemo } from 'react';
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

// Utilidades
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Crear un banco de letras que SIEMPRE incluye todas las letras (con repeticiones) del target.
// Agrega N distractores y baraja.
function buildLetterBank(target, extraCount = 3) {
  const t = target.toUpperCase();
  const base = t.split(''); // incluye duplicados
  const setInTarget = new Set(base);

  // Generar distractores que no estén repetidos en exceso
  const candidates = ALPHABET.filter((c) => !setInTarget.has(c));
  const extras = [];
  for (let i = 0; i < extraCount && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    extras.push(candidates.splice(idx, 1)[0]);
  }

  const combined = [...base, ...extras].map((char, i) => ({
    id: `${char}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    char,
    used: false,
  }));

  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export default function TranslateWordGame() {
  const questions = useMemo(
    () => [
      {
        sentence: 'She plays guitar in the',
        translation: 'Ella toca guitarra en la sala',
        target: 'LIVINGROOM', // L I V I N G R O O M (10)
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQynKd7-nYOz9wFCSbAfPBPqikX2YvR-Bpf2A&s',
      },
      {
        sentence: 'He cooks in the',
        translation: 'Él cocina en la cocina',
        target: 'KITCHEN', // 7
        image:
          'https://img.freepik.com/premium-vector/kitchen-with-stove-oven-stove-window_1025542-70867.jpg',
      },
      {
        sentence: 'I sleep in the',
        translation: 'Yo duermo en el dormitorio',
        target: 'BEDROOM', // B E D R O O M (7)
        image:
          'https://t3.ftcdn.net/jpg/02/00/48/10/360_F_200481040_e36DewfQr2xDonN5IOQxGgFUsoZSqHiK.jpg',
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(''); // lo ya armado
  const [modalVisible, setModalVisible] = useState(false);
  const [usedStack, setUsedStack] = useState([]); // pila de ids usados (para Borrar)
  const shakeRef = useRef(null);

  // Estrellas animadas
  const [stars, setStars] = useState([]);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const q = questions[current];
  const [letters, setLetters] = useState(() => buildLetterBank(q.target, 3));

  // Regenera el banco al cambiar de pregunta
  useEffect(() => {
    setLetters(buildLetterBank(q.target, 3));
    setProgress('');
    setUsedStack([]);
  }, [current]);

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

  // Manejo de click en letra
  const handleLetter = (item) => {
    if (modalVisible || item.used) return;
    const expected = q.target.toUpperCase()[progress.length];
    if (item.char === expected) {
      // marcar usada
      setLetters((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
      );
      setProgress((p) => p + item.char);
      setUsedStack((st) => [...st, item.id]);

      const nextLen = progress.length + 1;
      if (nextLen === q.target.length) {
        // palabra completa
        setTimeout(() => setModalVisible(true), 200);
      }
    } else {
      if (shakeRef.current) shakeRef.current.shake(700);
    }
  };

  const handleBackspace = () => {
    if (!progress.length || !usedStack.length) return;
    const lastId = usedStack[usedStack.length - 1];
    // liberar la última letra usada
    setLetters((prev) => prev.map((l) => (l.id === lastId ? { ...l, used: false } : l)));
    setUsedStack((st) => st.slice(0, -1));
    setProgress((p) => p.slice(0, -1));
  };

  const nextQuestion = () => {
    setModalVisible(false);
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
        onError={() => console.log('Error cargando imagen')}
      />

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Traduce lo restante a inglés:</Text>
      <Text style={styles.sentence}>{q.sentence}</Text>
      <Text style={styles.translation}>{q.translation}</Text>

      {/* Guiones */}
      <View style={styles.blanksContainer}>
        {q.target.toUpperCase().split('').map((_, i) => (
          <View key={i} style={styles.blank}>
            <Text style={styles.blankText}>{progress[i] || '_'}</Text>
          </View>
        ))}
      </View>

      {/* Letras */}
      <Animatable.View ref={shakeRef} style={styles.lettersContainer}>
        {letters.map((l) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.letterBtn, l.used && styles.letterBtnUsed]}
            onPress={() => handleLetter(l)}
            disabled={modalVisible || l.used}
          >
            <Text style={[styles.letterText, l.used && styles.letterTextUsed]}>{l.char}</Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>

      {/* Controles */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={[styles.ctrlBtn, styles.backBtn]} onPress={handleBackspace}>
          <Text style={styles.ctrlText}>Borrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctrlBtn, styles.resetBtn]}
          onPress={() => {
            // resetear progreso y liberar letras usadas
            setProgress('');
            setLetters((prev) => prev.map((l) => ({ ...l, used: false })));
            setUsedStack([]);
          }}
        >
          <Text style={styles.ctrlText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de éxito */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={500} style={[styles.popup, styles.correct]}>
            <Text style={styles.modalTitle}>¡Excelente!</Text>
            <Text style={styles.solvedWord}>{q.target.toUpperCase()}</Text>
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
    marginBottom: 12,
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
  letterBtnUsed: {
    opacity: 0.35,
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    fontFamily: 'Comic Sans MS',
  },
  letterTextUsed: {
    textDecorationLine: 'line-through',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 6,
  },
  ctrlBtn: {
    backgroundColor: '#ffe57f',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  ctrlText: {
    color: '#8d6200',
    fontWeight: 'bold',
    fontSize: 16,
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
    width: 300,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#13c26e',
    fontFamily: 'Comic Sans MS',
  },
  solvedWord: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
    fontFamily: 'Comic Sans MS',
  },
  btn: {
    backgroundColor: '#ffe57f',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 4,
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
