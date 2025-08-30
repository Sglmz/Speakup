import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Sprite from '../../Sprite';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;

function makeSeq(len=10){
  return Array.from({length:len},()=>1+Math.floor(Math.random()*99));
}

export default function NumbersEvenOddGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenNumbers' } = params ?? {};

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const seq = useMemo(()=>makeSeq(), []);
  const n = seq[idx];

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

  const pick = async (kind) => {
    const ok = (n%2===0 && kind==='even') || (n%2!==0 && kind==='odd');
    if (ok) setScore(s=>s+1);
    if (idx+1<seq.length) {
      setIdx(i=>i+1);
    } else {
      Alert.alert('¡Listo!', `Score: ${score + (ok?1:0)} / ${seq.length}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Fondo de estrellas */}
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

      <View style={s.wrap}>
        <View style={s.header}>
          <Text style={s.brand}>SpeakUp</Text>
          <Text style={s.title}>Numbers · Even/Odd</Text>
        </View>

        <View style={s.card}>
          <View style={s.dec}>
            <Sprite name="ball" group="numbers" size={64} />
            <Sprite name="apple" group="numbers" size={64} />
          </View>

          <Text style={s.big}>{n}</Text>

          <View style={s.row}>
            <BouncyButton kind="even"  onPress={()=>pick('even')}  bg="#C8E6C9" fg="#1B5E20">EVEN</BouncyButton>
            <BouncyButton kind="odd"   onPress={()=>pick('odd')}   bg="#FFCDD2" fg="#B71C1C">ODD</BouncyButton>
          </View>

          <Text style={s.footer}>Score: {score} · {idx+1}/{seq.length}</Text>
        </View>
      </View>
    </View>
  );
}

function BouncyButton({ children, onPress, bg, fg }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, friction:6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction:6 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ flex:1 }}>
      <Animated.View style={[s.btn, { backgroundColor:bg, transform:[{ scale }] }]}>
        <View style={s.btnGloss}/>
        <Text style={[s.bt, { color: fg }]}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, padding:16, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#5D4037', opacity:0.8, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#6D4C41', textShadowColor:'rgba(0,0,0,0.4)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },

  card:{ width:'100%', maxWidth:520, backgroundColor:'rgba(255,255,255,0.92)', padding:18, borderRadius:22, shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:3, alignItems:'center' },

  dec:{ flexDirection:'row', gap:16, marginTop:4 },
  big:{ fontSize:64, fontWeight:'900', color:'#5D4037', marginVertical:12, textShadowColor:'rgba(0,0,0,0.12)', textShadowOffset:{width:0,height:2}, textShadowRadius:3, fontFamily:'Comic Sans MS' },

  row:{ flexDirection:'row', gap:12, width:'100%' },
  btn:{ paddingVertical:16, paddingHorizontal:18, borderRadius:14, borderWidth:2, borderColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  btnGloss:{ position:'absolute', top:10, left:16, width:80, height:26, borderRadius:18, backgroundColor:'rgba(255,255,255,0.45)' },
  bt:{ fontWeight:'900', fontSize:18, letterSpacing:0.5, fontFamily:'Comic Sans MS' },

  footer:{ marginTop:10, color:'#3E2723', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
