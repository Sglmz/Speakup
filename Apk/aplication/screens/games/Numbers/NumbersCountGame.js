// NumbersCountGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from '../../../Sprite';


const ICONS = ['apple','star','ball'];
const TOTAL_ROUNDS = 8;

export default function NumbersCountGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllNumbersGamesScreen' } = params ?? {};

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const icon = useMemo(()=>ICONS[Math.floor(Math.random()*ICONS.length)], [round]);
  const n = useMemo(()=>3 + Math.floor(Math.random()*7), [round]);

  const opts = useMemo(()=>{
    const s=new Set([n]);
    while (s.size<4) s.add(n+Math.floor(Math.random()*5)-2);
    return [...s].sort(()=>Math.random()-0.5);
  }, [n]);

  const onPick = async (v) => {
    const ok = v===n;
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
      <Text style={s.t}>NUMBERS · Count</Text>
      <View style={s.box}>
        {Array.from({length:n}).map((_,i)=>(
          <Sprite key={i} name={icon} group="numbers" size={48} style={{margin:4}} />
        ))}
      </View>
      <View style={s.opts}>
        {opts.map(o=>(
          <TouchableOpacity key={o} style={s.btn} onPress={()=>onPick(o)}>
            <Text style={s.btnTxt}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.f}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#e0f7fa',padding:16},
  t:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#006064',marginBottom:8},
  box:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',marginVertical:10},
  opts:{gap:8},
  btn:{backgroundColor:'#b2ebf2',padding:14,borderRadius:12},
  btnTxt:{textAlign:'center',fontWeight:'bold',color:'#004d40'},
  f:{textAlign:'center',marginTop:10,color:'#006064'}
});
