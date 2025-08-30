import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;

const ITEMS = [
  { emoji:'🍳', item:'pan',          room:'kitchen' },
  { emoji:'🧬', item:'soap',         room:'bathroom' },
  { emoji:'🛎️', item:'bed',          room:'bedroom' },
  { emoji:'🛋️', item:'sofa',         room:'living room' },
  { emoji:'🚪', item:'door',         room:'hallway' },
  { emoji:'🧯', item:'extinguisher', room:'kitchen' },
  { emoji:'🖥️', item:'computer',     room:'study' },
];
const ROOMS = ['kitchen','bathroom','bedroom','living room','hallway','study'];

export default function HouseWhichRoomGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [qIdx, setQIdx] = useState(0);
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

  const qs = useMemo(() => {
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);
  const q = qs[qIdx];

  const answers = useMemo(() => {
    if (!q) return [];
    const wrong = ROOMS.filter(r => r !== q.room).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong, q.room].sort(() => Math.random() - 0.5);
  }, [q]);

  const pick = async (opt) => {
    if (!q) return;
    const isOk = opt === q.room;
    if (isOk) setScore(s => s + 1);

    if (qIdx + 1 < qs.length) {
      setQIdx(i => i + 1);
    } else {
      Alert.alert('¡Listo!', `Puntaje: ${score + (isOk ? 1 : 0)} / ${qs.length}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    }
  };

  if (!q) return null;

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
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

      <View style={st.wrap}>
        <View style={st.header}>
          <Text style={st.brand}>SpeakUp</Text>
          <Text style={st.title}>House · Which room?</Text>
        </View>

        <View style={st.card}>
          <View style={st.qBox}>
            <Text style={st.emoji}>{q.emoji}</Text>
            <Text style={st.q}>Where does "<Text style={st.bold}>{q.item}</Text>" belong?</Text>
          </View>

          <View style={st.opts}>
            {answers.map(a => (
              <BouncyButton key={a} onPress={() => pick(a)}>
                <Text style={st.btnTxt}>{a}</Text>
              </BouncyButton>
            ))}
          </View>

          <Text style={st.footer}>Score: {score} / {qIdx + 1}</Text>
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
      <Animated.View style={[st.btn, { transform:[{ scale }] }]}>
        <View style={st.btnGloss}/>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  wrap:{ flex:1, padding:16, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#5D4037', opacity:0.8, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#6D4C41', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },
  card:{ width:'100%', maxWidth:560, backgroundColor:'rgba(255,255,255,0.92)', padding:18, borderRadius:22, shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:3, alignItems:'center' },
  qBox:{ alignItems:'center', marginVertical:10 },
  emoji:{ fontSize:64 },
  q:{ fontSize:18, marginTop:6, color:'#333', textAlign:'center', fontFamily:'Comic Sans MS' },
  bold:{ fontWeight:'900', color:'#4E342E' },
  opts:{ width:'100%', marginTop:10, gap:10 },
  btn:{ backgroundColor:'#FFE082', paddingVertical:14, paddingHorizontal:16, borderRadius:14, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  btnGloss:{ position:'absolute', top:10, left:16, width:80, height:26, borderRadius:18, backgroundColor:'rgba(255,255,255,0.45)' },
  btnTxt:{ textAlign:'center', fontWeight:'900', color:'#4E342E', fontSize:18, letterSpacing:0.3, fontFamily:'Comic Sans MS' },
  footer:{ textAlign:'center', marginTop:10, color:'#3E2723', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
