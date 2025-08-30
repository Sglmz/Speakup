import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Sprite from '../../Sprite';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;

const WORDS = ['TABLE','CHAIR','DOOR','WINDOW','GARDEN'];
const ALPH  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function WordsHangmanLiteGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllWordsScreen' } = params ?? {};

  const [word] = useState(() => WORDS[Math.floor(Math.random()*WORDS.length)]);
  const [hits, setHits] = useState([]);
  const [fails, setFails] = useState(0);

  const masked = useMemo(
    () => word.split('').map(ch => (hits.includes(ch) ? ch : ' _ ')).join(''),
    [word, hits]
  );
  const won  = useMemo(() => masked.replace(/\s/g,'') === word, [masked, word]);
  const lost = fails >= 6;

  const pick = (ch) => {
    if (won || lost || hits.includes(ch)) return;
    if (word.includes(ch)) setHits(h => [...h, ch]);
    else setFails(f => f + 1);
  };

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
      const loop = () => {
        y.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(y, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(loop);
      };
      loop();
    });
    setStars(s);
  }, []);

  useEffect(() => {
    if (won) {
      setTimeout(async () => {
        Alert.alert('🏆 You win!', word);
        if (userId && gameId) {
          try { await saveProgress({ userId, gameId }); } catch {}
        }
        navigation.replace(backScreen, { userId, username, categoria });
      }, 300);
    }
  }, [won]);

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Fondo de estrellas SVG */}
      {stars.map((s,i)=>( 
        <Animated.View key={i} style={{
          position:'absolute', top:0, left:s.x,
          transform:[{ translateY:s.y }]
        }}>
          <Svg height="100" width="100" viewBox="0 0 40 40">
            <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
              fill="#FFF59D" opacity={0.4 + Math.random() * 0.6} />
          </Svg>
        </Animated.View>
      ))}

      {/* Contenido */}
      <View style={s.wrap}>
        <View style={s.header}>
          <Text style={s.brand}>SpeakUp</Text>
          <Text style={s.title}>Crea la palabra de la imagen</Text>
        </View>

        <View style={s.card}>
          <Sprite name={word.toLowerCase()} group="words" size={90} style={{ alignSelf:'center', marginTop:6 }} />

          <Text style={s.mask}>{masked}</Text>
          <Text style={s.info}>Fails: {fails}/6</Text>

          <View style={s.keys}>
            {ALPH.map(k => {
              const disabled = hits.includes(k) || won || lost;
              return (
                <KeyButton
                  key={k}
                  label={k}
                  disabled={disabled}
                  onPress={() => pick(k)}
                />
              );
            })}
          </View>

          {lost && <Text style={s.lose}>❌ You lose! Word: {word}</Text>}
        </View>
      </View>
    </View>
  );
}

function KeyButton({ label, onPress, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => !disabled && Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction:6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction:6 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} disabled={disabled} style={{ margin:3 }}>
      <Animated.View style={[
        s.key,
        disabled && s.keyOff,
        { transform:[{ scale }] }
      ]}>
        <View style={s.keyGloss}/>
        <Text style={s.kTxt}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, padding:12, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#5D4037', opacity:0.8, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#6D4C41', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },

  card:{ width:'100%', maxWidth:600, backgroundColor:'rgba(255,255,255,0.92)', padding:16, borderRadius:22, shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:3, alignItems:'center' },

  mask:{ textAlign:'center', fontSize:28, letterSpacing:2, color:'#1A237E', marginVertical:8, fontWeight:'900', fontFamily:'Comic Sans MS' },
  info:{ textAlign:'center', color:'#303F9F', fontFamily:'Comic Sans MS' },

  keys:{ flexDirection:'row', flexWrap:'wrap', gap:6, marginTop:10, justifyContent:'center' },
  key:{ backgroundColor:'#C5CAE9', borderRadius:10, paddingVertical:8, paddingHorizontal:10, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', minWidth:36, position:'relative', overflow:'hidden' },
  keyGloss:{ position:'absolute', top:6, left:8, width:40, height:18, borderRadius:12, backgroundColor:'rgba(255,255,255,0.45)' },
  keyOff:{ opacity:0.4 },
  kTxt:{ fontWeight:'900', color:'#1A237E', fontFamily:'Comic Sans MS' },

  lose:{ textAlign:'center', marginTop:8, color:'#B71C1C', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
