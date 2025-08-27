// HouseSpotItGame.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const POOL = [
  {emoji:'🛏️',label:'bed'}, {emoji:'🪑',label:'chair'}, {emoji:'🧂',label:'salt'},
  {emoji:'🍽️',label:'plate'}, {emoji:'🚿',label:'shower'}, {emoji:'🪟',label:'window'},
  {emoji:'🧊',label:'fridge'}, {emoji:'🧹',label:'broom'}, {emoji:'🛋️',label:'sofa'},
  {emoji:'🧺',label:'basket'}, {emoji:'🕯️',label:'candle'}, {emoji:'🗝️',label:'key'},
];

export default function HouseSpotItGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [target] = useState(()=>POOL[Math.floor(Math.random()*POOL.length)]);
  const [grid, setGrid] = useState([]);
  const [found, setFound] = useState(0);

  useEffect(()=>{
    const cells = Array.from({length:12},()=>POOL[Math.floor(Math.random()*POOL.length)]);
    for (let i=0;i<3;i++) cells[i]=target; // al menos 3 objetivos
    setGrid(cells.sort(()=>Math.random()-0.5));
  },[]);

  const onCell = async (idx) => {
    if (grid[idx].label===target.label) {
      const g=[...grid]; g[idx]={emoji:'✅',label:'ok'}; setGrid(g); setFound(f=>f+1);
      const anyLeft = g.some(c=>c.label===target.label);
      if (!anyLeft) {
        Alert.alert('🏆 Completed!', `You found all "${target.label}"`);
        if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
        navigation.replace(backScreen, { userId, username, categoria });
      }
    }
  };

  return (
    <View style={s.c}>
      <Text style={s.t}>HOUSE · Spot-It!</Text>
      <Text style={s.sub}>Find all: <Text style={{fontWeight:'bold'}}>{target.emoji} {target.label}</Text></Text>
      <View style={s.grid}>
        {grid.map((c,i)=>(
          <TouchableOpacity key={i} style={s.cell} onPress={()=>onCell(i)} activeOpacity={0.8}>
            <Text style={s.big}>{c.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.f}>Found: {found}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#e8f5e9',padding:16},
  t:{fontSize:22,fontWeight:'bold',textAlign:'center',color:'#1b5e20'},
  sub:{textAlign:'center',marginVertical:8,color:'#2e7d32'},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:10},
  cell:{width:'31%',aspectRatio:1,backgroundColor:'#c8e6c9',borderRadius:16,alignItems:'center',justifyContent:'center',marginBottom:10},
  big:{fontSize:36},
  f:{textAlign:'center',marginTop:6,color:'#1b5e20'},
});
