import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 50;

const COLORS = ['red','blue','green','yellow'];
const NAMES  = ['RED','BLUE','GREEN','YELLOW'];
const TOTAL_ROUNDS = 8;

export default function ColorsStroopGame() {
  const navigation = useNavigation();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenColors' } = useRoute().params ?? {};

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false }),
    ])).start();

    const s = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
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

  const card = useMemo(() => {
    const txt = NAMES[Math.floor(Math.random()*NAMES.length)];
    const styleColor = COLORS[Math.floor(Math.random()*COLORS.length)];
    const askText = Math.random() < 0.5;
    const pool = askText ? NAMES : COLORS;
    const options = [...pool].sort(() => Math.random()-0.5);
    return { txt, styleColor, askText, options };
  }, [round]);

  const onPick = async (opt) => {
    const ok = card.askText ? (opt === card.txt) : (opt === card.styleColor);
    if (ok) setScore(s => s + 1);

    const next = round + 1;
    if (next > TOTAL_ROUNDS) {
      Alert.alert('¡Listo!', `Puntaje: ${score + (ok ? 1 : 0)} / ${TOTAL_ROUNDS}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    } else {
      setRound(next);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo de estrellas grandes */}
      <View style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.star, { left: s.x, transform: [{ translateY: s.y }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon
                points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                fill="#FFF59D"
                opacity={0.5 + Math.random() * 0.5}
              />
            </Svg>
          </Animated.View>
        ))}
      </View>

      {/* Encabezado */}
      <Text style={styles.title}>Juego de Colores</Text>

      <View style={styles.card}>
        <Text style={styles.instruction}>
          {card.askText ? 'Toca el color de la palabra' : 'Toca el color de la tinta'}
        </Text>

        <Text style={[styles.bigText, { color: card.styleColor }]}>{card.txt}</Text>

        <View style={styles.options}>
          {card.options.map(o => (
            <BouncyButton key={o} onPress={() => onPick(o)}>
              <Text style={styles.btnText}>{card.askText ? o : o.toUpperCase()}</Text>
            </BouncyButton>
          ))}
        </View>

        <Text style={styles.footer}>
          Puntaje: {score} · Ronda: {round}/{TOTAL_ROUNDS}
        </Text>
      </View>
    </View>
  );
}

function BouncyButton({ children, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ width:'100%' }}>
      <Animated.View style={[styles.btn, { transform:[{ scale }] }]}>
        <View style={styles.btnGloss}/>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', alignItems: 'center' },
  star: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#4f2c04', marginTop: 22,
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14,
    fontFamily: 'Comic Sans MS', textAlign: 'center'
  },
  card: {
    marginTop: 20, width: '90%', backgroundColor: '#fffde7', padding: 20, borderRadius: 20,
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5
  },
  instruction: {
    fontSize: 18, fontFamily: 'Comic Sans MS', marginBottom: 10,
    textAlign: 'center', color: '#5D4037'
  },
  bigText: {
    fontSize: 48, fontWeight: 'bold', fontFamily: 'Comic Sans MS',
    marginVertical: 16, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.12)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3
  },
  options: {
    width: '100%', gap: 12, marginTop: 8
  },
  btn: {
    backgroundColor: '#BBDEFB', paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
  },
  btnGloss: {
    position: 'absolute', top: 10, left: 16, width: 80, height: 26,
    borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.45)'
  },
  btnText: {
    textAlign: 'center', fontWeight: 'bold', color: '#0D47A1',
    fontSize: 18, letterSpacing: 0.5, fontFamily: 'Comic Sans MS'
  },
  footer: {
    marginTop: 12, textAlign: 'center', color: '#3E2723',
    fontWeight: 'bold', fontFamily: 'Comic Sans MS'
  }
});
