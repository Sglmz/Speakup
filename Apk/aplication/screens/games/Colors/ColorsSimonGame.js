// ColorsSimonGame.js (Hermes-safe: sin setValue en valores nativos)
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;
const PADS = ['red','blue','green','yellow'];
const TARGET_LEVEL = 5;

export default function ColorsSimonGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenColors' } = params ?? {};

  const [seq, setSeq] = useState([rand()]);
  const [userIdx, setUserIdx] = useState(0);
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState('Memoriza y repite la secuencia');

  // ===== Fondo: estrellas (sin setValue, todo con interpolate + loop nativo) =====
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, () => {
      const startY = -50 - Math.random() * height * 0.6; // arranca arriba
      const endY = height + 50;                           // termina abajo
      const progress = new Animated.Value(Math.random()); // desfase inicial
      const duration = Math.random() * 5000 + 3000;       // 3–8s
      return {
        x: Math.random() * width,
        startY,
        endY,
        duration,
        progress,
      };
    });
  }, []);

  // brillo (0..1) para opacidad de estrellas
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Brillo en bucle (opacidad) — nativo
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    glowLoop.start();

    // Caída de estrellas — nativo, sin setValue
    const runs = stars.map(({ progress, duration }) =>
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )
    );
    runs.forEach(r => r.start());

    return () => {
      glowLoop.stop();
      runs.forEach(r => r.stop());
    };
  }, [glow, stars]);

  useEffect(() => { play(); }, [seq]);

  const play = async () => {
    setMsg('Memoriza y repite la secuencia');
    setUserIdx(0);
    for (let i = 0; i < seq.length; i++) {
      setActive(seq[i]); await sleep(520);
      setActive(null);   await sleep(220);
    }
    setMsg('¡Tu turno!');
  };

  const onPad = async (c) => {
    if (msg !== '¡Tu turno!') return;
    const expected = seq[userIdx];
    if (c === expected) {
      const next = userIdx + 1;
      if (next === seq.length) {
        const nextLen = seq.length + 1;
        if (nextLen > TARGET_LEVEL) {
          Alert.alert('🏆 ¡Ganaste!', `Nivel ${seq.length}`);
          if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
          navigation.replace(backScreen, { userId, username, categoria });
        } else {
          setMsg('¡Bien! +1'); await sleep(400);
          setSeq(s => [...s, rand()]);
        }
      } else {
        setUserIdx(next);
      }
    } else {
      setMsg('❌ ¡Incorrecto! Reiniciando…');
      await sleep(700);
      setSeq([rand()]);
    }
  };

  const levelText = useMemo(() => `Nivel: ${seq.length}/${TARGET_LEVEL}`, [seq]);

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Estrellas */}
      {stars.map((s,i)=> {
        const translateY = s.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [s.startY, s.endY],
          extrapolate: 'extend',
        });
        const opacity = glow.interpolate({ inputRange:[0,1], outputRange:[0.2,1] });
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position:'absolute',
              top:0,
              left:s.x,
              transform:[{ translateY }],
              width:6,
              height:6,
              borderRadius:3,
              backgroundColor:'#fff',
              opacity,
            }}
          />
        );
      })}

      <View style={styles.wrap}>
        <Text style={styles.header}>🎨 Juego de Colores · Simón</Text>
        <Text style={styles.level}>{levelText}</Text>

        <View style={styles.card}>
          <Text style={styles.msg}>{msg}</Text>

          <View style={styles.grid}>
            {PADS.map(p => (
              <ColorBox
                key={p}
                color={p}
                active={active===p}
                onPress={() => onPad(p)}
                disabled={msg !== '¡Tu turno!'}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function ColorBox({ color, active, onPress, disabled }) {
  // scale para "active" (nativo)
  const scale = useRef(new Animated.Value(1)).current;
  // feedback al toque (nativo)
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: active ? 1.2 : 1, friction: 5, useNativeDriver: true }).start();
  }, [active, scale]);

  const handlePressIn = () => {
    Animated.timing(press, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(press, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      if (!disabled && onPress) onPress();
    });
  };

  const opacity = press.interpolate({ inputRange:[0,1], outputRange:[1,0.6] });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled} style={{ margin: 10 }}>
      <Animated.View
        style={[
          styles.box,
          {
            backgroundColor: color,
            transform:[{ scale }],
            opacity,
            borderWidth: 2,
            borderColor: '#000',
          },
        ]}
      />
    </Pressable>
  );
}

const rand = () => PADS[Math.floor(Math.random()*PADS.length)];
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

const styles = StyleSheet.create({
  wrap:{ flex:1, alignItems:'center', justifyContent:'flex-start', padding:20 },
  header:{ fontSize:26, fontWeight:'900', color:'#5D4037', fontFamily:'Comic Sans MS', marginTop:20 },
  level:{ fontSize:16, color:'#BF360C', marginBottom:10, fontFamily:'Comic Sans MS' },
  card:{ width:'100%', maxWidth:500, backgroundColor:'white', borderRadius:20, padding:20, alignItems:'center', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:6 },
  msg:{ fontSize:16, color:'#000', marginBottom:14, fontFamily:'Comic Sans MS' },
  grid:{ width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-around', marginHorizontal:-10 },
  box:{ width:80, height:80, borderRadius:12 },
});
