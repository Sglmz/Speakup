// ColorsMixGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const PRIM = ['RED','BLUE','YELLOW'];
const TARGETS = [
  { name:'ORANGE', mix:['RED','YELLOW'] },
  { name:'PURPLE', mix:['RED','BLUE'] },
  { name:'GREEN',  mix:['BLUE','YELLOW'] },
];

export default function ColorsMixGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllGamesScreenColors' } = params ?? {};

  const [target] = useState(()=>TARGETS[Math.floor(Math.random()*TARGETS.length)]);
  const [pick, setPick] = useState([]);
  const ok = useMemo(()=>pick.length===2 && new Set(pick).size===2 &&
    target.mix.every(m=>pick.includes(m)), [pick, target]);

  const choose = async (c) => {
    if (pick.includes(c) || pick.length===2) return;
    const next = [...pick, c];
    setPick(next);
    if (next.length===2) {
      if (next.every(m=>target.mix.includes(m))) {
        Alert.alert('🎨 Correct!', `You made ${target.name}`);
        if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
        navigation.replace(backScreen, { userId, username, categoria });
      } else {
        Alert.alert('❌ Try again', 'Pick the right two primaries');
        setPick([]);
      }
    }
  };

  return (
    <View style={s.c}>
      <Text style={s.t}>COLORS · Mix</Text>
      <Text style={s.sub}>Make: <Text style={s.target}>{target.name}</Text></Text>
      <View style={s.row}>
        {PRIM.map(p=>(
          <TouchableOpacity key={p} style={[s.circle,{backgroundColor:p.toLowerCase(),opacity: pick.includes(p)?0.6:1}]} onPress={()=>choose(p)} />
        ))}
      </View>
      <Text style={s.info}>Pick two primaries.</Text>
      <View style={s.badgeBox}>
        {pick.map(p=>(<View key={p} style={s.badge}><Text style={s.badgeTxt}>{p}</Text></View>))}
      </View>
      {pick.length===2 && (
        <Text style={[s.result,{color: ok?'#2e7d32':'#b71c1c'}]}>{ok?'✅ Correct!':'❌ Try again'}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#fff3e0',padding:16,alignItems:'center'},
  t:{fontSize:22,fontWeight:'bold',color:'#e65100'},
  sub:{marginTop:6,color:'#e65100'},
  target:{fontWeight:'900'},
  row:{flexDirection:'row',gap:16,marginTop:16},
  circle:{width:90,height:90,borderRadius:45},
  info:{marginTop:12,color:'#6d4c41'},
  badgeBox:{flexDirection:'row',gap:8,marginTop:10},
  badge:{backgroundColor:'#ffe0b2',paddingHorizontal:10,paddingVertical:6,borderRadius:999},
  badgeTxt:{fontWeight:'bold',color:'#6d4c41'},
  result:{marginTop:12,fontSize:18,fontWeight:'bold'}
});
