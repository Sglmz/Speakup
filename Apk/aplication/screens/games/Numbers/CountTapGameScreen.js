import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '../../../config';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80, ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const buildLetterBank = (target, extraCount = 3) => {
  const base = target.toUpperCase().split(''), set = new Set(base), extras = [];
  const cands = ALPHABET.filter(c => !set.has(c));
  for (let i = 0; i < extraCount && cands.length; i++) extras.push(cands.splice(Math.floor(Math.random() * cands.length), 1)[0]);
  const combined = [...base, ...extras].map((char, i) => ({ id: `${char}-${i}-${Math.random().toString(36).slice(2, 7)}`, char, used: false }));
  for (let i = combined.length - 1; i > 0; i--) [combined[i], combined[Math.floor(Math.random() * (i + 1))]] = [combined[Math.floor(Math.random() * (i + 1))], combined[i]];
  return combined;
};

export default function TranslateWordGame() {
  const route = useRoute(), { userId, gameId } = route.params ?? {};
  const questions = useMemo(() => [
    { sentence: 'She plays guitar in the', translation: 'Ella toca guitarra en la sala', target: 'LIVINGROOM', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQynKd7-nYOz9wFCSbAfPBPqikX2YvR-Bpf2A&s' },
    { sentence: 'He cooks in the', translation: 'Él cocina en la cocina', target: 'KITCHEN', image: 'https://img.freepik.com/premium-vector/kitchen-with-stove-oven-stove-window_1025542-70867.jpg' },
    { sentence: 'I sleep in the', translation: 'Yo duermo en el dormitorio', target: 'BEDROOM', image: 'https://t3.ftcdn.net/jpg/02/00/48/10/360_F_200481040_e36DewfQr2xDonN5IOQxGgFUsoZSqHiK.jpg' },
  ], []);
  const [current, setCurrent] = useState(0), [progress, setProgress] = useState(''), [modalVisible, setModalVisible] = useState(false);
  const [usedStack, setUsedStack] = useState([]), [stars, setStars] = useState([]), shakeRef = useRef(null);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const q = questions[current], [letters, setLetters] = useState(() => buildLetterBank(q.target, 3));

  useEffect(() => {
    setLetters(buildLetterBank(q.target, 3)); setProgress(''); setUsedStack([]);
  }, [current]);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false })
    ])).start();
  }, []);

  useEffect(() => {
    const gen = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));
    gen.forEach(({ translateY, speed }) => {
      const anim = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(anim);
      };
      anim();
    });
    setStars(gen);
  }, []);

  const glowColor = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ['#ffeb3b', '#ffd54f'] });

  const handleLetter = (item) => {
    if (modalVisible || item.used) return;
    const expected = q.target.toUpperCase()[progress.length];
    if (item.char === expected) {
      setLetters(prev => prev.map(l => l.id === item.id ? { ...l, used: true } : l));
      setProgress(p => p + item.char);
      setUsedStack(st => [...st, item.id]);
      if (progress.length + 1 === q.target.length) {
        setTimeout(() => setModalVisible(true), 200);
        if (userId && gameId) {
          fetch(`${API_URL}/guardar_progreso.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, gameId })
          }).then(res => res.json()).then(data => console.log('✔️ Progreso guardado:', data)).catch(err => console.error('❌ Error al guardar progreso:', err));
        }
      }
    } else shakeRef.current?.shake(700);
  };

  const handleBackspace = () => {
    if (!progress.length || !usedStack.length) return;
    const lastId = usedStack.at(-1);
    setLetters(prev => prev.map(l => l.id === lastId ? { ...l, used: false } : l));
    setUsedStack(st => st.slice(0, -1));
    setProgress(p => p.slice(0, -1));
  };

  return (
    <View style={s.c}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View key={i} style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <Animated.Text style={[s.q, { backgroundColor: glowColor }]}>Ordena la oración</Animated.Text>
      <Image source={{ uri: q.image }} style={s.img} resizeMode="cover" />
      <Text style={s.st}>Traduce lo restante a inglés:</Text>
      <Text style={s.se}>{q.sentence}</Text>
      <Text style={s.tr}>{q.translation}</Text>

      <View style={s.bc}>
        {q.target.toUpperCase().split('').map((_, i) => (
          <View key={i} style={s.b}><Text style={s.bt}>{progress[i] || '_'}</Text></View>
        ))}
      </View>

      <Animatable.View ref={shakeRef} style={s.lc}>
        {letters.map(l => (
          <TouchableOpacity key={l.id} style={[s.lb, l.used && s.lbU]} onPress={() => handleLetter(l)} disabled={modalVisible || l.used}>
            <Text style={[s.lt, l.used && s.ltU]}>{l.char}</Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>

      <View style={s.row}>
        <TouchableOpacity style={[s.ctrl, s.red]} onPress={handleBackspace}><Text style={s.ct}>Borrar</Text></TouchableOpacity>
        <TouchableOpacity style={[s.ctrl, s.blue]} onPress={() => {
          setProgress('');
          setLetters(prev => prev.map(l => ({ ...l, used: false })));
          setUsedStack([]);
        }}><Text style={s.ct}>Reiniciar</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={s.mo}>
          <Animatable.View animation="zoomIn" duration={500} style={[s.po, s.ok]}>
            <Text style={s.msg}>✅ ¡Correcto!</Text>
            <Text style={s.ans}>{q.target.toUpperCase()}</Text>
            <TouchableOpacity style={s.btn} onPress={() => {
              setModalVisible(false);
              setCurrent(p => (p + 1) % questions.length);
            }}><Text style={s.btnT}>Siguiente</Text></TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B', paddingTop: 40 },
  s: { position: 'absolute' },
  q: { fontSize: 22, fontWeight: 'bold', color: '#4f2c04', padding: 12, borderRadius: 14, textAlign: 'center', marginBottom: 20, alignSelf: 'center' },
  img: { width: width * 0.9, height: height * 0.25, borderRadius: 12, alignSelf: 'center', marginBottom: 10 },
  st: { fontSize: 16, fontWeight: 'bold', color: '#4e342e', textAlign: 'center' },
  se: { fontSize: 20, fontWeight: 'bold', color: '#4e342e', marginVertical: 6, textAlign: 'center' },
  tr: { fontSize: 16, fontStyle: 'italic', color: '#5d4037', marginBottom: 10, textAlign: 'center' },
  bc: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 },
  b: { width: 34, height: 44, backgroundColor: '#fff', margin: 4, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  bt: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  lc: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10 },
  lb: { backgroundColor: '#FFD54F', margin: 5, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  lbU: { backgroundColor: '#ccc' },
  lt: { fontSize: 18, fontWeight: 'bold', color: '#4e342e' },
  ltU: { color: '#888' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 16 },
  ctrl: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14 },
  red: { backgroundColor: '#e57373' },
  blue: { backgroundColor: '#64b5f6' },
  ct: { color: '#fff', fontWeight: 'bold' },
  mo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  po: { backgroundColor: '#fff', padding: 30, borderRadius: 24, alignItems: 'center', width: 300, elevation: 10 },
  ok: { backgroundColor: '#B6FCD5', borderWidth: 2, borderColor: '#13c26e' },
  msg: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  ans: { fontSize: 26, fontWeight: 'bold', color: '#222', marginBottom: 15 },
  btn: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  btnT: { color: '#8d6200', fontWeight: 'bold', fontSize: 18 }
});
