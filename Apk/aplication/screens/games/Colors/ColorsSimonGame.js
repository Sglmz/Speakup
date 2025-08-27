// ColorsSimonGame.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const PADS = ['red','blue','green','yellow'];
const TARGET_LEVEL = 5;

export default function ColorsSimonGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenColors' } = params ?? {};

  const [seq, setSeq] = useState([rand()]);
  const [userIdx, setUserIdx] = useState(0);
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState('Watch the sequence…');

  useEffect(()=>{ play(); /* eslint-disable-next-line */ }, [seq]);

  const play = async () => {
    setMsg('Watch the sequence…');
    setUserIdx(0);
    for (let i=0;i<seq.length;i++){
      setActive(seq[i]); await sleep(500);
      setActive(null); await sleep(200);
    }
    setMsg('Your turn!');
  };

  const onPad = async (c) => {
    if (msg!=='Your turn!') return;
    const expected = seq[userIdx];
    if (c===expected){
      const next = userIdx+1;
      if (next===seq.length){
        const nextLen = seq.length+1;
        if (nextLen > TARGET_LEVEL) {
          Alert.alert('🏆 Great!', `Level ${seq.length}`);
          if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
          navigation.replace(backScreen, { userId, username, categoria });
        } else {
          setMsg('Great! +1'); await sleep(400);
          setSeq(s=>[...s, rand()]);
        }
      } else {
        setUserIdx(next);
      }
    } else {
      setMsg('❌ Wrong! Restarted');
      await sleep(700);
      setSeq([rand()]);
    }
  };

  return (
    <View style={s.c}>
      <Text style={s.t}>COLORS · Simon</Text>
      <View style={s.grid}>
        {PADS.map(p=>(
          <TouchableOpacity key={p} style={[s.pad,{backgroundColor:p, opacity: active===p?0.5:1}]} onPress={()=>onPad(p)} />
        ))}
      </View>
      <Text style={s.msg}>{msg}</Text>
      <Text style={s.level}>Level: {seq.length}/{TARGET_LEVEL}</Text>
    </View>
  );
}

const rand = () => PADS[Math.floor(Math.random()*PADS.length)];
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#f1f8e9',padding:16,alignItems:'center'},
  t:{fontSize:22,fontWeight:'bold',color:'#33691e',marginBottom:10},
  grid:{width:'90%',aspectRatio:1,flexDirection:'row',flexWrap:'wrap',gap:10,justifyContent:'space-between'},
  pad:{width:'48%',aspectRatio:1,borderRadius:16},
  msg:{marginTop:12,color:'#33691e'},
  level:{marginTop:4,fontWeight:'bold',color:'#1b5e20'}
});
