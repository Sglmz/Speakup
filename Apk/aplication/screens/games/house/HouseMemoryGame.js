// HouseMemoryGame.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';

const PAIRS = [
  { k: 'bed', emoji: '🛏️', word: 'bedroom' },
  { k: 'bath', emoji: '🚿', word: 'bathroom' },
  { k: 'sofa', emoji: '🛋️', word: 'living room' },
  { k: 'fridge', emoji: '🧊', word: 'kitchen' },
  { k: 'book', emoji: '📚', word: 'study' },
  { k: 'plant', emoji: '🪴', word: 'balcony' },
];

export default function HouseMemoryGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]); // keys
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const deck = [...PAIRS, ...PAIRS]
      .map((c, i) => ({ ...c, id: i + Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const onPressCard = (idx) => {
    if (flipped.includes(idx) || matched.includes(cards[idx].k)) return;
    const nf = [...flipped, idx];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nf;
      const A = cards[a], B = cards[b];
      if (A.k === B.k) {
        setMatched((m) => [...m, A.k]);
        setTimeout(() => setFlipped([]), 600);
      } else {
        setTimeout(() => setFlipped([]), 650);
      }
    } else if (nf.length > 2) {
      setFlipped([idx]);
    }
  };

  useEffect(() => {
    const finished = matched.length === PAIRS.length && cards.length;
    if (finished) {
      setTimeout(async () => {
        Alert.alert('🏆 ¡Completado!', `Movimientos: ${moves}`);
        if (userId && gameId) {
          try { await saveProgress({ userId, gameId }); } catch {}
        }
        navigation.replace(backScreen, { userId, username, categoria });
      }, 400);
    }
  }, [matched, moves, cards.length]);

  return (
    <View style={s.c}>
      <Text style={s.t}>HOUSE · Memory</Text>
      <View style={s.grid}>
        {cards.map((c, i) => {
          const isUp = flipped.includes(i) || matched.includes(c.k);
          return (
            <TouchableOpacity key={c.id} style={[s.card, isUp && s.up]} onPress={() => onPressCard(i)} activeOpacity={0.8}>
              <Text style={s.cardTxt}>{isUp ? c.emoji : '❓'}</Text>
              {isUp ? <Text style={s.word}>{c.word}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={s.m}>Movimientos: {moves}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#fff9c4',padding:16},
  t:{fontSize:22,fontWeight:'bold',textAlign:'center',marginVertical:8,color:'#6d4c41'},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
  card:{width:'31%',aspectRatio:1,backgroundColor:'#ffe082',borderRadius:16,marginBottom:10,alignItems:'center',justifyContent:'center'},
  up:{backgroundColor:'#c8e6c9'},
  cardTxt:{fontSize:32},
  word:{fontSize:12,color:'#335',marginTop:6},
  m:{textAlign:'center',marginTop:8,color:'#6d4c41',fontWeight:'600'}
});
