// HouseMemoryGame.js (Hermes-safe, solo animaciones nativas)
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 35;

const PAIRS = [
  { k: 'bed',    emoji: '🛏️', word: 'bedroom' },
  { k: 'bath',   emoji: '🚿', word: 'bathroom' },
  { k: 'sofa',   emoji: '🛋️', word: 'living room' },
  { k: 'fridge', emoji: '🧊', word: 'kitchen' },
  { k: 'book',   emoji: '📚', word: 'study' },
  { k: 'plant',  emoji: '🪴', word: 'balcony' },
];

export default function HouseMemoryGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  // ===== Fondo: estrellas con progress (sin setValue) =====
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, () => {
      const startY = -50 - Math.random() * height * 0.6;
      const endY = height + 50;
      const progress = new Animated.Value(Math.random());
      const duration = Math.random() * 5000 + 3000; // 3–8s
      return { x: Math.random() * width, startY, endY, duration, progress };
    });
  }, []);

  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Brillo (opacidad) nativo
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    glowLoop.start();

    // Caída de estrellas nativa
    const runs = stars.map(({ progress, duration }) =>
      Animated.loop(
        Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
      )
    );
    runs.forEach(r => r.start());

    // Mazo de cartas
    const deck = [...PAIRS, ...PAIRS]
      .map((c, i) => ({ ...c, id: `${c.k}-${i}-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);

    return () => {
      glowLoop.stop();
      runs.forEach(r => r.stop());
    };
  }, [stars, glow]);

  const onPressCard = (idx) => {
    if (flipped.includes(idx) || matched.includes(cards[idx].k)) return;

    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = nextFlipped;
      const A = cards[a], B = cards[b];
      if (A.k === B.k) {
        setMatched(m => [...m, A.k]);
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 550);
      }
    } else if (nextFlipped.length > 2) {
      setFlipped([idx]);
    }
  };

  useEffect(() => {
    const finished = matched.length === PAIRS.length && cards.length > 0;
    if (finished) {
      setTimeout(async () => {
        Alert.alert('🏆 ¡Completado!', `Movimientos: ${moves}`);
        if (userId && gameId) { try { await saveProgress({ userId, gameId }); } catch {} }
        navigation.replace(backScreen, { userId, username, categoria });
      }, 350);
    }
  }, [matched, moves, cards.length, navigation, backScreen, userId, username, categoria, gameId]);

  return (
    <View style={{ flex:1, backgroundColor:'#FFEB3B' }}>
      {/* Estrellas */}
      {stars.map((s,i) => {
        const translateY = s.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [s.startY, s.endY],
          extrapolate: 'extend',
        });
        const opacity = glow.interpolate({ inputRange:[0,1], outputRange:[0.3,1] });
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position:'absolute',
              top:0,
              left:s.x,
              transform:[{ translateY }],
              width:5, height:5, borderRadius:2,
              backgroundColor:'#fff',
              opacity,
            }}
          />
        );
      })}

      <View style={st.wrap}>
        <View style={st.header}>
          <Text style={st.brand}>SpeakUp</Text>
          <Text style={st.title}>🏠 House · Memory</Text>
        </View>

        <View style={st.card}>
          <Text style={st.subtitle}>Encuentra las parejas</Text>

          <View style={st.grid}>
            {cards.map((c, i) => {
              const isUp = flipped.includes(i) || matched.includes(c.k);
              return (
                <MemoryCard
                  key={c.id}
                  isUp={isUp}
                  emoji={c.emoji}
                  word={c.word}
                  onPress={() => onPressCard(i)}
                />
              );
            })}
          </View>

          <Text style={st.moves}>Movimientos: {moves}</Text>
        </View>
      </View>
    </View>
  );
}

function MemoryCard({ isUp, emoji, word, onPress }) {
  // Animaciones nativas: scale + opacity (sin sombras animadas)
  const scale = useRef(new Animated.Value(1)).current;
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: isUp ? 1.05 : 1, friction: 5, useNativeDriver: true }).start();
  }, [isUp, scale]);

  const onPressIn  = () => Animated.timing(press, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  const onPressOut = () => Animated.timing(press, { toValue: 0, duration: 120, useNativeDriver: true }).start();

  const opacity = press.interpolate({ inputRange:[0,1], outputRange:[1, 0.85] });
  const touchScale = press.interpolate({ inputRange:[0,1], outputRange:[1, 0.92] });

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{ width:'31%', aspectRatio:1, marginBottom:10 }}
    >
      <Animated.View
        style={[
          st.cardItem,
          isUp ? st.cardUp : null,
          {
            transform:[{ scale }, { scale: touchScale }],
            opacity,
            // Sombras y bordes estáticos (no animarlos)
            shadowOpacity:0.25,
            shadowRadius:10,
            shadowColor:'#000',
            shadowOffset:{ width:0, height:6 },
          },
        ]}
      >
        <View style={st.cardGloss}/>
        <Text style={st.cardEmoji}>{isUp ? emoji : '❓'}</Text>
        {isUp ? <Text style={st.cardWord}>{word}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  wrap:{ flex:1, padding:16, alignItems:'center', justifyContent:'flex-start' },
  header:{ width:'100%', alignItems:'center', marginTop:8, marginBottom:12 },
  brand:{ fontSize:16, color:'#fff', opacity:0.7, fontFamily:'Comic Sans MS' },
  title:{ fontSize:28, fontWeight:'900', color:'#F57C00', textShadowColor:'rgba(0,0,0,0.6)', textShadowOffset:{width:0,height:2}, textShadowRadius:4, fontFamily:'Comic Sans MS' },
  card:{ width:'100%', maxWidth:560, backgroundColor:'rgba(255,255,255,0.95)', padding:20, borderRadius:24, elevation:4, alignItems:'center' },
  subtitle:{ fontSize:16, color:'#5D4037', marginBottom:12, fontFamily:'Comic Sans MS' },
  grid:{ width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' },
  cardItem:{ flex:1, backgroundColor:'#FFF59D', borderRadius:18, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'#FFB300', position:'relative', overflow:'hidden' },
  cardUp:{ backgroundColor:'#AED581' },
  cardGloss:{ position:'absolute', top:10, left:12, width:70, height:24, borderRadius:16, backgroundColor:'rgba(255,255,255,0.4)' },
  cardEmoji:{ fontSize:34 },
  cardWord:{ fontSize:13, color:'#334', marginTop:6, fontFamily:'Comic Sans MS' },
  moves:{ marginTop:14, color:'#3E2723', fontWeight:'bold', fontFamily:'Comic Sans MS' },
});
