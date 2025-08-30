// WordsUnscrambleGame.js (Hermes-safe stars + sin gap + keys únicas)
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Sprite from '../../Sprite';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 40;

const BANK = ['TABLE','CHAIR','WINDOW','GARDEN','DOOR'];

export default function WordsUnscrambleGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllWordsScreen' } = params ?? {};

  const [solution] = useState(() => BANK[Math.floor(Math.random() * BANK.length)]);
  const [picked, setPicked] = useState([]);

  // Barajamos letras pero conservamos índice original para distinguir duplicadas
  const letters = useMemo(
    () => solution.split('').map((ch, i) => ({ ch, i })).sort(() => Math.random() - 0.5),
    [solution]
  );

  const guess = picked.map(x => x.split(':')[0]).join('');
  const done  = guess.length === solution.length;
  const ok    = done && guess === solution;

  const tap = (ch, idx) => {
    const key = `${ch}:${idx}`;
    if (picked.includes(key)) return;
    if (picked.length < solution.length) setPicked(p => [...p, key]);
  };
  const clear = () => setPicked([]);

  // ===== Fondo de estrellas (Hermes-safe: sin setValue, todo nativo) =====
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, () => {
      const startY = -50 - Math.random() * height * 0.6;
      const endY   = height + 50;
      const progress = new Animated.Value(Math.random()); // desfase inicial 0..1
      const duration = 3000 + Math.random() * 5000;       // 3–8s
      const x = Math.random() * width;
      return { x, startY, endY, progress, duration };
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

  useEffect(() => {
    if (ok) {
      setTimeout(async () => {
        Alert.alert('✅ Correct', solution);
        if (userId && gameId) {
          try { await saveProgress({ userId, gameId }); } catch {}
        }
        navigation.replace(backScreen, { userId, username, categoria });
      }, 300);
    }
  }, [ok, solution, navigation, backScreen, userId, username, categoria, gameId]);

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Estrellas animadas */}
      {stars.map((s, idx) => {
        const translateY = s.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [s.startY, s.endY],
          extrapolate: 'extend',
        });
        const opacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
        return (
          <Animated.View
            key={`star-${idx}`}
            style={{
              position:'absolute',
              top:0,
              left:s.x,
              transform:[{ translateY }],
              width:6, height:6, borderRadius:3, backgroundColor:'#fff',
              opacity,
            }}
            pointerEvents="none"
          />
        );
      })}

      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.brand}>SpeakUp</Text>
        <Text style={styles.title}>Words · Unscramble</Text>
        </View>

        <View style={styles.card}>
          <Sprite name={solution.toLowerCase()} group="words" size={90} style={{ alignSelf:'center', marginTop:6 }} />
          <Text style={styles.target}>Arrange: {solution.length} letters</Text>

          <View style={styles.letters}>
            {letters.map(({ ch, i }) => {
              const used = picked.includes(`${ch}:${i}`);
              return (
                <Tile
                  key={`tile-${i}-${ch}`}
                  label={ch}
                  used={used}
                  onPress={() => !used && tap(ch, i)}
                />
              );
            })}
          </View>

          <Text style={styles.guess}>{guess}</Text>

          <View style={styles.row}>
            <BouncyButton onPress={clear}>
              <Text style={styles.btnTxt}>Clear</Text>
            </BouncyButton>
          </View>

          {done && !ok && <Text style={[styles.res, { color:'#B71C1C' }]}>❌ Wrong</Text>}
        </View>
      </View>
    </View>
  );
}

function Tile({ label, used, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => !used && Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction: 6 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} disabled={used} style={{ margin: 4 }}>
      <Animated.View style={[styles.tile, used && styles.off, { transform:[{ scale }] }]}>
        <View style={styles.tileGloss}/>
        <Text style={styles.tileTxt}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function BouncyButton({ children, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction: 6 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ marginTop: 8 }}>
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
  brand:{ fontSize:16, color:'#000', opacity:0.7, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#D32F2F', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },

  card:{ width:'100%', maxWidth:600, backgroundColor:'#fff', padding:18, borderRadius:22, shadowColor:'#000', shadowOpacity:0.2, shadowRadius:8, shadowOffset:{width:0,height:4}, elevation:3, alignItems:'center' },

  target:{ textAlign:'center', marginTop:6, color:'#333', fontFamily:'Comic Sans MS' },

  // sin 'gap' (usamos márgenes en cada Tile)
  letters:{ flexDirection:'row', flexWrap:'wrap', marginTop:10, justifyContent:'center' },
  tile:{ backgroundColor:'#FFCC80', paddingVertical:12, paddingHorizontal:14, borderRadius:12, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', minWidth:44, position:'relative', overflow:'hidden' },
  off:{ opacity:0.3 },
  tileGloss:{ position:'absolute', top:6, left:8, width:50, height:20, borderRadius:12, backgroundColor:'rgba(255,255,255,0.45)' },
  tileTxt:{ fontWeight:'900', fontSize:20, color:'#4E342E', fontFamily:'Comic Sans MS' },

  guess:{ textAlign:'center', marginTop:12, fontSize:26, fontWeight:'bold', color:'#4E342E', fontFamily:'Comic Sans MS' },
  row:{ flexDirection:'row', justifyContent:'center', marginTop:8 },
  btn:{ backgroundColor:'#FFD54F', paddingHorizontal:16, paddingVertical:10, borderRadius:12, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  btnGloss:{ position:'absolute', top:6, left:10, width:70, height:20, borderRadius:14, backgroundColor:'rgba(255,255,255,0.45)' },
  btnTxt:{ fontWeight:'900', color:'#4E342E', fontSize:16, fontFamily:'Comic Sans MS' },

  res:{ textAlign:'center', marginTop:10, fontWeight:'bold', fontSize:18, fontFamily:'Comic Sans MS' },
});
