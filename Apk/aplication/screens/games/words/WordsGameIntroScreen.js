import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80;

export default function WordsGameIntro({ navigation, route }) {
  const userId = route?.params?.userId ?? null, username = route?.params?.username ?? '', categoria = route?.params?.categoria ?? null;
  const [progress, setProgress] = useState(0), [loading, setLoading] = useState(true), [stars, setStars] = useState([]);

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

  useEffect(() => {
  if (!userId || !categoria) return console.warn('Faltan datos en WordsGameIntro:', route?.params), setLoading(false);
  fetch(`${API_URL}ver_progreso.php?userId=${userId}&categoria=${categoria}`)
    .then(res => res.json())
    .then(json => json.status === "success" ? setProgress(json.progress) : console.warn("Error en progreso:", json.message))
    .catch(err => console.error("❌ Error al obtener progreso:", err))
    .finally(() => setLoading(false));
}, [userId, categoria]);

  return (
    <View style={s.c} key={route?.key}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View key={i} style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <View style={s.v}>
        <Animatable.View animation="fadeInDown" delay={100}>
          <Icon name="format-letter-case" size={80} color="#81C784" style={{ marginBottom: 30 }} />
        </Animatable.View>
        <Animatable.Text animation="fadeInDown" delay={300} style={s.t}>Palabras</Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} style={s.sT}>¿Listo para aprender nuevas palabras en inglés?</Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={800} style={s.pB}>
          {loading ? <ActivityIndicator size="small" color="#388E3C" /> : <Text style={s.pT}>Progreso: {progress}%</Text>}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1100}>
          <TouchableOpacity style={s.b} onPress={() => navigation.navigate('AllWordsScreen', { userId, username, progress, categoria })} activeOpacity={0.85}>
            <Text style={s.bT}>¡Empezar!</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B', justifyContent: 'center', alignItems: 'center' },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  v: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  t: { fontFamily: 'Comic Sans MS', fontSize: 40, color: '#388E3C', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  sT: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#444', marginBottom: 30, textAlign: 'center' },
  pB: { backgroundColor: '#fffde7', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 35, marginBottom: 32, elevation: 2 },
  pT: { color: '#388E3C', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  b: { backgroundColor: '#388E3C', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 20, elevation: 3 },
  bT: { color: '#fff', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 }
});
