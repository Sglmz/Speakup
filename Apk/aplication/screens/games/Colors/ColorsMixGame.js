// ColorsMixGame.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Animated, Dimensions,
  StyleSheet, BackHandler
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { saveProgress } from '../../utils/apiProgress';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

const PRIM = ['RED', 'BLUE', 'YELLOW'];
const TARGETS = [
  { name: 'ORANGE', mix: ['RED', 'YELLOW'] },
  { name: 'PURPLE', mix: ['RED', 'BLUE'] },
  { name: 'GREEN', mix: ['BLUE', 'YELLOW'] }
];

export default function ColorsMixGame() {
  const navigation = useNavigation();
  const { userId, categoria, gameId, username, backScreen = 'AllGamesScreenColors' } = useRoute().params;
  const [stars, setStars] = useState([]);
  const glow = useRef(new Animated.Value(0)).current;

  const [target] = useState(() => TARGETS[Math.floor(Math.random() * TARGETS.length)]);
  const [pick, setPick] = useState([]);
  const [modal, setModal] = useState(false);
  const [ok, setOk] = useState(false);
  const [lives, setLives] = useState(3);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false })
    ])).start();

    const s = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));
    s.forEach(({ y, speed }) => {
      const a = () => {
        y.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(y, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(a);
      };
      a();
    });
    setStars(s);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => completed);
    return () => backHandler.remove();
  }, [completed]);

  const choose = (color) => {
    if (pick.includes(color) || pick.length === 2) return;
    const next = [...pick, color];
    setPick(next);
    if (next.length === 2) {
      const success = target.mix.every(c => next.includes(c));
      setOk(success);
      setTimeout(() => setModal(true), 500);
      if (!success) setLives(l => Math.max(0, l - 1));
    }
  };

  const closeModal = async () => {
    setModal(false);
    if (ok) {
      if (userId && gameId) {
        try { await saveProgress({ userId, gameId }); } catch (e) {}
      }
      navigation.replace(backScreen, { userId, categoria, username });
    } else {
      if (lives <= 0) {
        navigation.replace(backScreen, { userId, categoria, username });
      } else {
        setPick([]);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Estrellas animadas */}
      <View style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.star, { left: s.x, transform: [{ translateY: s.y }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                fill="#FFF59D" opacity={0.4 + Math.random() * 0.6} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <Animated.Text style={[styles.title, {
        backgroundColor: glow.interpolate({
          inputRange: [0, 1],
          outputRange: ['#ffa94d', '#fff59d']
        })
      }]}>
        Juego de Colores · Mezcla
      </Animated.Text>

      <Text style={styles.lives}>❤️ Vidas: {lives}</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Objetivo:</Text>
        <Text style={styles.target}>
          Mezcla para obtener <Text style={styles.highlight}>{target.name}</Text>
        </Text>

        <View style={styles.options}>
          {PRIM.map(c => (
            <TouchableOpacity key={c} onPress={() => choose(c)} disabled={pick.includes(c) || pick.length === 2}
              style={[styles.btn, { backgroundColor: c.toLowerCase() }]}>
              <Text style={styles.btnText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.badgeBox}>
          {pick.map(p => (
            <View key={p} style={styles.badge}>
              <Text style={styles.badgeText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modal de resultado */}
      <Modal visible={modal} transparent animationType="fade">
        <View style={styles.overlay}>
          <Animatable.View animation="zoomIn" duration={400} style={[styles.popup, ok ? styles.correct : styles.incorrect]}>
            <Text style={styles.msg}>
              {ok
                ? `¡Bien! Mezclaste ${pick[0]} + ${pick[1]} = ${target.name}`
                : 'Ups, esa no es la mezcla correcta'}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>{ok || lives <= 0 ? 'Volver' : 'Intentar otra vez'}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', alignItems: 'center', justifyContent: 'flex-start' },
  star: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#4f2c04', marginTop: 20,
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, elevation: 3,
    fontFamily: 'Comic Sans MS', textAlign: 'center'
  },
  lives: {
    textAlign: 'center', fontSize: 20, fontWeight: 'bold',
    color: '#d32f2f', marginTop: 8, fontFamily: 'Comic Sans MS'
  },
  card: {
    marginTop: 20, width: '90%', backgroundColor: '#fffde7', padding: 20, borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5
  },
  subtitle: { fontSize: 18, fontFamily: 'Comic Sans MS', marginBottom: 5 },
  target: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Comic Sans MS', marginBottom: 20 },
  highlight: { color: '#e65100' },
  options: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12
  },
  btn: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12,
    marginVertical: 8, width: 120, alignItems: 'center'
  },
  btnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: 'Comic Sans MS',
    textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2
  },
  badgeBox: {
    marginTop: 16, flexDirection: 'row', justifyContent: 'center', gap: 8
  },
  badge: {
    backgroundColor: '#ffe082', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1, borderColor: '#d7ccc8'
  },
  badgeText: {
    fontWeight: 'bold', color: '#4e342e', fontFamily: 'Comic Sans MS'
  },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center', justifyContent: 'center'
  },
  popup: {
    backgroundColor: '#fff', padding: 30, borderRadius: 22, width: 320,
    alignItems: 'center', elevation: 8
  },
  correct: {
    shadowColor: '#4caf50', shadowOpacity: 0.6, shadowRadius: 12, borderColor: '#81c784', borderWidth: 3
  },
  incorrect: {
    backgroundColor: '#ffcccb', borderColor: '#e53935', borderWidth: 3
  },
  msg: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 14,
    fontFamily: 'Comic Sans MS', textAlign: 'center'
  },
  modalBtn: {
    backgroundColor: '#ffd54f', paddingHorizontal: 24,
    paddingVertical: 10, borderRadius: 12
  },
  modalBtnText: {
    fontSize: 18, fontWeight: 'bold', color: '#6d4c41', fontFamily: 'Comic Sans MS'
  }
});
