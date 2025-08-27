// HouseWhichRoomGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const ITEMS = [
  { emoji:'🍳', item:'pan', room:'kitchen' },
  { emoji:'🧼', item:'soap', room:'bathroom' },
  { emoji:'🛏️', item:'bed', room:'bedroom' },
  { emoji:'🛋️', item:'sofa', room:'living room' },
  { emoji:'🚪', item:'door', room:'hallway' },
  { emoji:'🧯', item:'extinguisher', room:'kitchen' },
  { emoji:'🖥️', item:'computer', room:'study' },
];
const ROOMS = ['kitchen','bathroom','bedroom','living room','hallway','study'];

export default function HouseWhichRoomGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const qs = useMemo(() => ITEMS.sort(()=>Math.random()-0.5).slice(0,6), []);
  const q = qs[qIdx];

  const answers = useMemo(() => {
    const wrong = ROOMS.filter(r=>r!==q.room).sort(()=>Math.random()-0.5).slice(3);
    return [...wrong, q.room].sort(()=>Math.random()-0.5);
  }, [q]);

  const pick = async (opt) => {
    if (opt === q.room) setScore(s=>s+1);
    if (qIdx+1<qs.length) {
      setQIdx(i=>i+1);
    } else {
      Alert.alert('¡Listo!', `Puntaje: ${score + (opt===q.room?1:0)} / ${qs.length}`);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    }
  };

  return (
    <View style={st.c}>
      <Text style={st.title}>HOUSE · Which room?</Text>
      <View style={st.qBox}>
        <Text style={st.emoji}>{q.emoji}</Text>
        <Text style={st.q}>Where does "{q.item}" belong?</Text>
      </View>
      <View style={st.opts}>
        {answers.map(a=>(
          <TouchableOpacity key={a} style={st.btn} onPress={()=>pick(a)} activeOpacity={0.85}>
            <Text style={st.btnTxt}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={st.footer}>Score: {score} / {qIdx+1}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  c:{flex:1,backgroundColor:'#fffde7',padding:16},
  title:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#5d4037',marginBottom:12},
  qBox:{alignItems:'center',marginVertical:10},
  emoji:{fontSize:64},
  q:{fontSize:18,marginTop:6,color:'#333'},
  opts:{marginTop:10,gap:8},
  btn:{backgroundColor:'#ffe0b2',padding:14,borderRadius:12},
  btnTxt:{textAlign:'center',fontWeight:'700',color:'#4e342e'},
  footer:{textAlign:'center',marginTop:10,color:'#6d4c41'},
});
