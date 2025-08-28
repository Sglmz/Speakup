// WordsMissingLetterGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from '../../../Sprite';


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
  const { userId, username, categoria, gameId, backScreen='AllWordsGamesScreen' } = params ?? {};

  const [round, setRound] = useState(1);
  const q = useMemo(()=>buildQ(), [round]);
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);

  const pick = (ch)=>{
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
    <View style={s.c}>
      <Text style={s.t}>WORDS · Missing Letter</Text>
      <Sprite name={q.full.toLowerCase()} group="words" size={90} style={{alignSelf:'center', marginTop:6}} />
      <Text style={s.big}>{q.raw}</Text>
      <View style={s.opts}>
        {q.options.map(o=>(
          <TouchableOpacity key={o} style={s.btn} onPress={()=>pick(o)}>
            <Text style={s.btnTxt}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {res && <Text style={s.res}>{res}</Text>}
      <Text style={s.footer}>Score: {score} · Round: {round}/{TOTAL_ROUNDS}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#e0f2f1',padding:16},
  t:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#004d40'},
  big:{textAlign:'center',fontSize:36,fontWeight:'900',color:'#00695c',marginVertical:10},
  opts:{gap:8},
  btn:{backgroundColor:'#b2dfdb',padding:14,borderRadius:12},
  btnTxt:{textAlign:'center',fontWeight:'bold',color:'#004d40'},
  res:{textAlign:'center',marginTop:8,fontWeight:'bold',color:'#00695c'},
  footer:{textAlign:'center',marginTop:10,color:'#00695c'}
});
