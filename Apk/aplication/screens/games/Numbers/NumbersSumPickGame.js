// NumbersSumPickGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from './Sprite';

const TOTAL_ROUNDS = 8;

function makeQ(){
  const a = 3+Math.floor(Math.random()*9);
  const b = 2+Math.floor(Math.random()*8);
  const miss = Math.random()<0.5?'a':'b';
  const res = a+b;
  return {a,b,res,miss};
}

export default function NumbersSumPickGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllNumbersGamesScreen' } = params ?? {};

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const q = useMemo(()=>makeQ(), [round]);

  const correct = q.miss==='a'? q.a : q.b;
  const options = useMemo(()=>{
    const pool = new Set([correct]);
    while (pool.size<4) pool.add(correct + (Math.floor(Math.random()*7)-3));
    return [...pool].sort(()=>Math.random()-0.5);
  }, [correct]);

  const onPick = async (n) => {
    const ok = n===correct;
    if (ok) setScore(s=>s+1);
    const next = round+1;
    if (next > TOTAL_ROUNDS) {
      Alert.alert('¡Listo!', `Score: ${score + (ok?1:0)} / ${TOTAL_ROUNDS}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    } else {
      setRound(next);
    }
  };

  return (
    <View style={s.c}>
      <Text style={s.t}>NUMBERS · Complete</Text>
      <View style={s.dec}>
        <Sprite name="apple" group="numbers" size={60} />
        <Sprite name="star" group="numbers" size={60} />
        <Sprite name="ball" group="numbers" size={60} />
      </View>
      <Text style={s.q}>
        {q.miss==='a' ? '□' : q.a} + {q.miss==='b' ? '□' : q.b} = {q.res}
      </Text>
      <View style={s.opts}>
        {options.map(o=>(
          <TouchableOpacity key={o} style={s.btn} onPress={()=>onPick(o)} activeOpacity={0.85}>
            <Text style={s.btnTxt}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.f}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#ede7f6',padding:16},
  t:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#4527a0',marginBottom:8},
  dec:{flexDirection:'row',justifyContent:'center',gap:16,marginTop:4},
  q:{textAlign:'center',fontSize:36,fontWeight:'900',color:'#311b92',marginVertical:12},
  opts:{gap:8},
  btn:{backgroundColor:'#d1c4e9',padding:14,borderRadius:12},
  btnTxt:{textAlign:'center',fontWeight:'bold',color:'#311b92'},
  f:{textAlign:'center',marginTop:10,color:'#4527a0'}
});
