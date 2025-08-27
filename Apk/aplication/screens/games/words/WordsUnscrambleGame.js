// WordsUnscrambleGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from './Sprite';

const BANK = ['TABLE','CHAIR','WINDOW','GARDEN','DOOR'];

export default function WordsUnscrambleGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllWordsGamesScreen' } = params ?? {};

  const [solution] = useState(()=>BANK[Math.floor(Math.random()*BANK.length)]);
  const [picked, setPicked] = useState([]);

  const letters = useMemo(()=>solution.split('').sort(()=>Math.random()-0.5), [solution]);
  const guess = picked.map(x=>x.split(':')[0]).join('');
  const done = guess.length===solution.length;
  const ok = done && guess===solution;

  const tap = (ch, idx) => {
    if (picked.find(p=>p===`${ch}:${idx}`)) return;
    if (picked.length<solution.length) setPicked(p=>[...p, `${ch}:${idx}`]);
  };
  const clear = () => setPicked([]);

  if (ok) {
    setTimeout(async () => {
      Alert.alert('✅ Correct', solution);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    }, 300);
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>WORDS · Unscramble</Text>
      <Sprite name={solution.toLowerCase()} group="words" size={90} style={{alignSelf:'center', marginTop:6}} />
      <Text style={s.target}>Arrange: {solution.length} letters</Text>
      <View style={s.letters}>
        {letters.map((ch, i)=>{
          const used = picked.includes(`${ch}:${i}`);
          return (
            <TouchableOpacity key={i} style={[s.tile, used && s.off]} onPress={()=>!used&&tap(ch,i)}>
              <Text style={s.tileTxt}>{ch}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={s.guess}>{guess}</Text>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={clear}><Text style={s.btnTxt}>Clear</Text></TouchableOpacity>
      </View>
      {done && !ok && <Text style={[s.res,{color:'#b71c1c'}]}>❌ Wrong</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#f3e5f5',padding:16},
  t:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#6a1b9a'},
  target:{textAlign:'center',marginTop:6,color:'#6a1b9a'},
  letters:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:10,justifyContent:'center'},
  tile:{backgroundColor:'#e1bee7',paddingVertical:10,paddingHorizontal:12,borderRadius:10},
  off:{opacity:0.4},
  tileTxt:{fontWeight:'900',fontSize:18,color:'#4a148c'},
  guess:{textAlign:'center',marginTop:10,fontSize:24,fontWeight:'bold',color:'#4a148c'},
  row:{flexDirection:'row',justifyContent:'center',marginTop:8},
  btn:{backgroundColor:'#d1c4e9',paddingHorizontal:16,paddingVertical:10,borderRadius:10},
  btnTxt:{fontWeight:'bold',color:'#4a148c'},
  res:{textAlign:'center',marginTop:8,fontWeight:'bold',fontSize:18}
});
