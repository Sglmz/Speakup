// NumbersEvenOddGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from './Sprite';

function makeSeq(len=10){
  return Array.from({length:len},()=>1+Math.floor(Math.random()*99));
}

export default function NumbersEvenOddGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllNumbersGamesScreen' } = params ?? {};

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const seq = useMemo(()=>makeSeq(), []);
  const n = seq[idx];

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
    <View style={s.c}>
      <Text style={s.t}>NUMBERS · Even/Odd</Text>
      <View style={s.dec}>
        <Sprite name="ball" group="numbers" size={70} />
        <Sprite name="apple" group="numbers" size={70} />
      </View>
      <Text style={s.big}>{n}</Text>
      <View style={s.row}>
        <TouchableOpacity style={[s.b,s.green]} onPress={()=>pick('even')}><Text style={s.bt}>EVEN</Text></TouchableOpacity>
        <TouchableOpacity style={[s.b,s.red]} onPress={()=>pick('odd')}><Text style={s.bt}>ODD</Text></TouchableOpacity>
      </View>
      <Text style={s.f}>Score: {score} · {idx+1}/{seq.length}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#fff8e1',padding:16,alignItems:'center'},
  t:{fontSize:22,fontWeight:'bold',color:'#e65100',marginBottom:8},
  dec:{flexDirection:'row',gap:16,marginTop:4},
  big:{fontSize:64,fontWeight:'900',color:'#5d4037',marginVertical:12},
  row:{flexDirection:'row',gap:12},
  b:{paddingVertical:16,paddingHorizontal:28,borderRadius:12},
  green:{backgroundColor:'#c8e6c9'},
  red:{backgroundColor:'#ffcdd2'},
  bt:{fontWeight:'bold',fontSize:18,color:'#333'},
  f:{marginTop:10,color:'#6d4c41'},
});
