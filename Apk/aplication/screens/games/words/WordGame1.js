
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

// Palabras disponibles
const WORDS = [
  { word: 'DOG', img: 'https://cdn.pixabay.com/photo/2016/02/19/10/00/dog-1207816_1280.jpg' },
  { word: 'CAT', img: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg' },
  { word: 'BIRD', img: 'https://cdn.pixabay.com/photo/2014/04/05/11/39/bird-317540_1280.jpg' },
  { word: 'FISH', img: 'https://cdn.pixabay.com/photo/2016/11/18/15/01/fish-1833650_1280.jpg' }
];

export default function SpellWordScreen({ route, navigation }) {
  const { userId, gameId, username } = route.params || {};
  const [target, setTarget] = useState('');
  const [image, setImage] = useState('');
  const [prog, setProg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const shakeRefs = useRef({});
  const [letters, setLetters] = useState([]);
  const [lives, setLives] = useState(3);

  // Estado para estrellas animadas
  const [stars, setStars] = useState([]);

  // generar palabra al azar
  useEffect(() => {
    const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(choice.word);
    setImage(choice.img);

    // generar letras aleatorias (target + extras)
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let mix = [...choice.word];
    while (mix.length < choice.word.length + 4) {
      const r = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!mix.includes(r)) mix.push(r);
    }
    setLetters(mix.sort(() => Math.random() - 0.5));
  }, []);

  // Animación del fondo con estrellas cayendo
  useEffect(() => {
    const gen = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));

    gen.forEach(({ translateY, speed }) => {
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

    setStars(gen);
  }, []);

  const handleLetter = (l) => {
    const exp = target[prog.length];
    if (l === exp) {
      const next = prog + l;
      setProg(next);
      if (next.length === target.length) {
        setModalVisible(true);
      }
    } else {
      const ref = shakeRefs.current[l];
      if (ref) ref.shake(800);
      setLives(prev => {
        if (prev - 1 <= 0) {
          setLostModal(true);
          return 0;
        }
        return prev - 1;
      });
    }
  };

  return (
    <View style={styles.c}>
      {/* Fondo animado */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.s, { left: s.x, transform: [{ translateY: s.translateY }] }]}>
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

      {/* Vidas */}
      <Text style={styles.lives}>❤️ {lives}</Text>

      <Text style={styles.t}>¡Deletrea el animal!</Text>
      <Image source={{ uri: image }} style={styles.i} />

      {/* Slots */}
      <View style={styles.bc}>
        {target.split('').map((_, i) => (
          <View key={i} style={styles.b}>
            <Text style={styles.bt}>{prog[i] || '_'}</Text>
          </View>
        ))}
      </View>

      {/* Botones letras */}
      <View style={styles.lc}>
        {letters.map((l, i) => (
          <Animatable.View key={i} ref={(ref) => (shakeRefs.current[l] = ref)}>
            <TouchableOpacity style={styles.lb} onPress={() => handleLetter(l)} disabled={modalVisible || lostModal}>
              <Text style={styles.lt}>{l}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Ganar */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.mo}>
          <Animatable.View animation="zoomIn" duration={500} style={[styles.p, styles.cr]}>
            <Text style={styles.mt}>¡Excelente!</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
              <Text style={styles.btnT}>Volver</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      {/* Perder */}
      <Modal visible={lostModal} transparent animationType="fade">
        <View style={styles.mo}>
          <Animatable.View animation="shake" duration={500} style={[styles.p, { borderColor: 'red', borderWidth: 2 }]}>
            <Text style={[styles.mt, { color: 'red' }]}>¡Has perdido!</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
              <Text style={styles.btnT}>Reintentar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B', paddingTop: 40 },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  t: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#4f2c04', fontFamily: 'Comic Sans MS' },
  i: { width: 200, height: 200, alignSelf: 'center', marginBottom: 20, borderRadius: 16 },
  bc: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  b: { borderBottomWidth: 3, borderColor: '#333', width: 50, marginHorizontal: 8, alignItems: 'center' },
  bt: { fontSize: 28, fontWeight: 'bold', fontFamily: 'Comic Sans MS' },
  lc: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10 },
  lb: { backgroundColor: '#FFD54F', width: (width - 100) / 4, paddingVertical: 16, margin: 8, borderRadius: 12, alignItems: 'center' },
  lt: { fontSize: 22, fontWeight: 'bold', color: '#4e342e', fontFamily: 'Comic Sans MS' },
  mo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  p: { backgroundColor: '#fff', padding: 32, borderRadius: 20, alignItems: 'center', width: 300 },
  cr: { borderWidth: 2, borderColor: '#13c26e' },
  mt: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, fontFamily: 'Comic Sans MS', color: '#13c26e' },
  btn: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 10 },
  btnT: { color: '#8d6200', fontWeight: 'bold', fontSize: 18, fontFamily: 'Comic Sans MS' },
  lives: { fontSize: 20, fontWeight: 'bold', color: '#d32f2f', textAlign: 'center', marginBottom: 10 }
});
