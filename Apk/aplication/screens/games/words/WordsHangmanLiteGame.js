// WordsHangmanLiteGame.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../../utils/apiProgress';
import Sprite from './Sprite';

const WORDS = ['TABLE','CHAIR','DOOR','WINDOW','GARDEN'];
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function WordsHangmanLiteGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllWordsGamesScreen' } = params ?? {};

  const [word] = useState(()=>WORDS[Math.floor(Math.random()*WORDS.length)]);
  const [hits, setHits] = useState([]);
  const [fails, setFails] = useState(0);

  const masked = useMemo(()=>word.split('').map(ch=>hits.includes(ch)? ch : ' _ ').join(''), [word, hits]);
  const won = masked.replace(/\s/g,'')===word;
  const lost = fails>=6;

  const pick = async (ch) => {
    if (won||lost||hits.includes(ch)) return;
    if (word.includes(ch)) setHits(h=>[...h,ch]); else setFails(f=>f+1);
  };

  if (won) {
    setTimeout(async () => {
      Alert.alert('🏆 You win!', word);
      if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
      navigation.replace(backScreen, { userId, username, categoria });
    }, 300);
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>WORDS · Hangman (Hint)</Text>
      <Sprite name={word.toLowerCase()} group="words" size={90} style={{alignSelf:'center', marginTop:6}} />
      <Text style={s.mask}>{masked}</Text>
      <Text style={s.info}>Fails: {fails}/6</Text>
      <View style={s.keys}>
        {ALPH.map(k=>(
          <TouchableOpacity disabled={hits.includes(k)} key={k} style={[s.key, hits.includes(k)&&s.keyOff]} onPress={()=>pick(k)}>
            <Text style={s.kTxt}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {lost && <Text style={s.lose}>❌ You lose! Word: {word}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#e8eaf6',padding:12},
  t:{textAlign:'center',fontSize:22,fontWeight:'bold',color:'#303f9f',marginBottom:8},
  mask:{textAlign:'center',fontSize:28,letterSpacing:2,color:'#1a237e',marginVertical:8},
  info:{textAlign:'center',color:'#303f9f'},
  keys:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:10,justifyContent:'center'},
  key:{backgroundColor:'#c5cae9',borderRadius:8,paddingVertical:8,paddingHorizontal:10},
  keyOff:{opacity:0.4},
  kTxt:{fontWeight:'bold',color:'#1a237e'},
  lose:{textAlign:'center',marginTop:8,color:'#b71c1c',fontWeight:'bold'}
});
