import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Sprite from '../../Sprite';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;

const WORDS = [
  { raw:'W_NDOW', full:'WINDOW' },
  { raw:'GARD_N', full:'GARDEN' },
  { raw:'TAB_E',  full:'TABLE' },
  { raw:'CHA_R',  full:'CHAIR' },
  { raw:'DO_R',   full:'DOOR' },
];
const TOTAL_ROUNDS = 6;

function buildQ(){
  const pick = WORDS[Math.floor(Math.random()*WORDS.length)];
  const missingIdx = pick.raw.indexOf('_');
  const correct = pick.full[missingIdx];
  const optsSet = new Set([correct]);
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (optsSet.size<4) optsSet.add(letters[Math.floor(Math.random()*letters.length)]);
  return { ...pick, correct, options:[...optsSet].sort(()=>Math.random()-0.5) };
}

export default function WordsMissingLetterGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllWordsScreen' } = params ?? {};

  const [round, setRound] = useState(1);
  const q = useMemo(()=>buildQ(), [round]);
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);

  const [stars, setStars] = useState([]);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue:1, duration:1500, useNativeDriver:false }),
      Animated.timing(glow, { toValue:0, duration:1500, useNativeDriver:false }),
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

  const pick = async (ch)=>{
    const ok = ch===q.correct;
    setRes(ok? '✅ Correct' : `❌ Wrong ( ${q.full} )`);
    if (ok) setScore(s=>s+1);
    setTimeout(async ()=>{
      setRes(null);
      const next = round+1;
      if (next > TOTAL_ROUNDS) {
        Alert.alert('¡Listo!', `Score: ${score + (ok?1:0)} / ${TOTAL_ROUNDS}`);
        if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
        navigation.replace(backScreen, { userId, username, categoria });
      } else {
        setRound(next);
      }
    }, 900);
  };

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
          <Text style={s.title}>Words · Missing Letter</Text>
        </View>

        <View style={s.card}>
          <Sprite name={q.full.toLowerCase()} group="words" size={90} style={{ alignSelf:'center', marginTop:6 }} />

          <Text style={s.big}>{q.raw}</Text>

          <View style={s.opts}>
            {q.options.map(o=>(
              <BouncyButton key={o} onPress={()=>pick(o)}>
                <Text style={s.btnTxt}>{o}</Text>
              </BouncyButton>
            ))}
          </View>

          {res && <Text style={s.res}>{res}</Text>}
          <Text style={s.footer}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
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
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ width:'100%' }}>
      <Animated.View style={[s.btn, { transform:[{ scale }] }]}>
        <View style={s.btnGloss}/>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, padding:16, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#5D4037', opacity:0.8, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#6D4C41', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },

  card:{ width:'100%', maxWidth:560, backgroundColor:'rgba(255,255,255,0.92)', padding:18, borderRadius:22, shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:3, alignItems:'center' },

  big:{ textAlign:'center', fontSize:40, fontWeight:'900', color:'#00695C', marginVertical:12, textShadowColor:'rgba(0,0,0,0.12)', textShadowOffset:{width:0,height:2}, textShadowRadius:3, fontFamily:'Comic Sans MS' },

  opts:{ width:'100%', gap:10 },
  btn:{ backgroundColor:'#B2DFDB', paddingVertical:14, paddingHorizontal:16, borderRadius:14, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  btnGloss:{ position:'absolute', top:10, left:16, width:80, height:26, borderRadius:18, backgroundColor:'rgba(255,255,255,0.45)' },
  btnTxt:{ textAlign:'center', fontWeight:'900', color:'#004D40', fontSize:20, letterSpacing:0.3, fontFamily:'Comic Sans MS' },

  res:{ textAlign:'center', marginTop:8, fontWeight:'bold', color:'#00695C', fontFamily:'Comic Sans MS' },
  footer:{ textAlign:'center', marginTop:10, color:'#3E2723', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
