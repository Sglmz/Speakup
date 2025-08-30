// NumbersCountGame.js (sumas con palabras en inglés + animaciones Hermes-safe + keys únicas)
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;
const TOTAL_ROUNDS = 8;

// Palabras 0..20
const NUM_WORDS = [
  'zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'
];
const numToWord = (n) => (n >= 0 && n < NUM_WORDS.length ? NUM_WORDS[n] : String(n));

// Crear una suma en palabras que totalice n (dos o tres sumandos)
function makeSumFor(n) {
  const parts = [];
  if (Math.random() < 0.5) {
    const a = 1 + Math.floor(Math.random() * (n - 1));
    const b = n - a;
    parts.push(a, b);
  } else {
    const a = 1 + Math.floor(Math.random() * (n - 2));
    const b = 1 + Math.floor(Math.random() * (n - a - 1));
    const c = n - a - b;
    parts.push(a, b, c);
  }
  return parts.map(numToWord).join(' + ');
}

export default function NumbersCountGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllNumbersGamesScreen' } = params ?? {};

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  // ===== Fondo de estrellas (Hermes-safe) =====
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, () => {
      const startY = -50 - Math.random() * height * 0.6;
      const endY   = height + 50;
      const progress = new Animated.Value(Math.random());
      const duration = Math.random() * 5000 + 3000; // 3–8s
      return { x: Math.random()*width, startY, endY, progress, duration };
    });
  }, []);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    glowLoop.start();

    const runs = stars.map(({ progress, duration }) =>
      Animated.loop(
        Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
      )
    );
    runs.forEach(r => r.start());

    return () => {
      glowLoop.stop();
      runs.forEach(r => r.stop());
    };
  }, [glow, stars]);

  // ===== Lógica del juego =====
  // n entre 3 y 9
  const n = useMemo(() => 3 + Math.floor(Math.random() * 7), [round]);

  const statement = useMemo(() => `${makeSumFor(n)} = □`, [n]);

  const opts = useMemo(() => {
    const setVals = new Set([n]);
    while (setVals.size < 4) {
      const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
      const v = Math.min(20, Math.max(1, n + delta));
      setVals.add(v);
    }
    return [...setVals].sort(() => Math.random() - 0.5);
  }, [n]);

  const onPick = async (v) => {
    const ok = v === n;
    if (ok) setScore(s => s + 1);
    const next = round + 1;
    if (next > TOTAL_ROUNDS) {
      Alert.alert('Great job!', `Score: ${score + (ok ? 1 : 0)} / ${TOTAL_ROUNDS}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    } else {
      setRound(next);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Fondo de estrellas */}
      {stars.map((s, i) => {
        const translateY = s.progress.interpolate({
          inputRange: [0,1],
          outputRange: [s.startY, s.endY],
          extrapolate: 'extend',
        });
        const opacity = glow.interpolate({ inputRange:[0,1], outputRange:[0.4, 1] });
        return (
          <Animated.View
            key={`star-${i}`}
            style={{ position:'absolute', top:0, left:s.x, transform:[{ translateY }], opacity }}
            pointerEvents="none"
          >
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" />
            </Svg>
          </Animated.View>
        );
      })}

      {/* Contenido */}
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.brand}>SpeakUp</Text>
          <Text style={styles.title}>Numbers · Count</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>How many in total?</Text>

          {/* Suma en palabras */}
          <Text style={styles.big}>{statement}</Text>

          {/* Opciones en palabras (enviamos el valor numérico) */}
          <View style={styles.opts}>
            {opts.map((o, i) => (
              <BouncyButton key={`r${round}-opt-${o}-${i}`} onPress={() => onPick(o)}>
                <Text style={styles.btnTxt}>{numToWord(o)}</Text>
              </BouncyButton>
            ))}
          </View>

          <Text style={styles.footer}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
        </View>
      </View>
    </View>
  );
}

function BouncyButton({ children, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction:6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction:6 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ width:'100%', marginBottom:10 }}>
      <Animated.View style={[styles.btn, { transform:[{ scale }] }]}>
        <View style={styles.btnGloss}/>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap:{ flex:1, padding:16, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#5D4037', opacity:0.8, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#6D4C41', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },

  card:{ width:'100%', maxWidth:560, backgroundColor:'rgba(255,255,255,0.92)', padding:18, borderRadius:22, elevation:3, alignItems:'center' },

  subtitle:{ fontSize:16, color:'#5D4037', marginBottom:8, fontFamily:'Comic Sans MS' },
  big:{ textAlign:'center', fontSize:36, fontWeight:'900', color:'#311B92', marginVertical:18, fontFamily:'Comic Sans MS' },

  opts:{ width:'100%' }, // sin 'gap' para nativo
  btn:{ backgroundColor:'#FFE082', paddingVertical:14, paddingHorizontal:16, borderRadius:14, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  btnGloss:{ position:'absolute', top:10, left:16, width:80, height:26, borderRadius:18, backgroundColor:'rgba(255,255,255,0.45)' },
  btnTxt:{ textAlign:'center', fontWeight:'900', color:'#4E342E', fontSize:20, letterSpacing:0.3, fontFamily:'Comic Sans MS' },

  footer:{ textAlign:'center', marginTop:10, color:'#3E2723', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
