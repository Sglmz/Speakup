// ColorsStroopGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const COLORS = ['red','blue','green','yellow'];
const NAMES = ['RED','BLUE','GREEN','YELLOW'];
const TOTAL_ROUNDS = 8;

export default function ColorsStroopGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenColors' } = params ?? {};

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const card = useMemo(()=>{
    const txt = NAMES[Math.floor(Math.random()*NAMES.length)];
    const styleColor = COLORS[Math.floor(Math.random()*COLORS.length)];
    const askText = Math.random()<0.5; // true: significado; false: color de la tinta
    const options = (askText? NAMES : COLORS).sort(()=>Math.random()-0.5);
    return {txt,styleColor,askText,options};
  }, [round]);

  const onPick = async (opt) => {
    const ok = card.askText ? opt===card.txt : opt===card.styleColor;
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
      <Text style={s.t}>COLORS · Stroop</Text>
      <Text style={s.sub}>{card.askText?'Tap the MEANING':'Tap the INK COLOR'}</Text>
      <Text style={[s.big,{color:card.styleColor}]}>{card.txt}</Text>
      <View style={s.opts}>
        {card.options.map(o=>(
          <TouchableOpacity key={o} style={s.btn} onPress={()=>onPick(o)} activeOpacity={0.85}>
            <Text style={s.btnTxt}>{card.askText? o : o.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.f}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#e3f2fd',padding:16},
  t:{fontSize:22,fontWeight:'bold',textAlign:'center',color:'#0d47a1'},
  sub:{textAlign:'center',marginVertical:6,color:'#1565c0'},
  big:{textAlign:'center',fontSize:48,fontWeight:'900',marginVertical:10},
  opts:{gap:8,marginTop:6},
  btn:{backgroundColor:'#bbdefb',padding:14,borderRadius:12},
  btnTxt:{textAlign:'center',fontWeight:'700',color:'#0d47a1'},
  f:{textAlign:'center',marginTop:8,color:'#0d47a1'}
});
