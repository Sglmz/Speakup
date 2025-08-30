// HouseSpotItGame.js (con fondo amarillo y estrellas tipo ColorsMixGame)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveProgress } from '../../utils/apiProgress';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 50;

const POOL = [
  {emoji:'👯️',label:'bed'}, {emoji:'🪑',label:'chair'}, {emoji:'🧂',label:'salt'},
  {emoji:'🍽️',label:'plate'}, {emoji:'🚿',label:'shower'}, {emoji:'🪟',label:'window'},
  {emoji:'🫪',label:'fridge'}, {emoji:'🧹',label:'broom'}, {emoji:'🛋️',label:'sofa'},
  {emoji:'🧺',label:'basket'}, {emoji:'🔯',label:'candle'}, {emoji:'🔑',label:'key'}
];

export default function HouseSpotItGame() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userId, username, categoria, gameId, backScreen='AllHouseGamesScreen' } = params ?? {};

  const [target] = useState(() => POOL[Math.floor(Math.random() * POOL.length)]);
  const [grid, setGrid] = useState([]);
  const [found, setFound] = useState(0);
  const [stars, setStars] = useState([]);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false }),
    ])).start();

    const s = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
    }));
    s.forEach(({ y, speed }) => {
      const loop = () => {
        y.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(y, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(loop);
      };
      loop();
    });
    setStars(s);

    const cells = Array.from({ length: 12 }, () => POOL[Math.floor(Math.random() * POOL.length)]);
    for (let i = 0; i < 3; i++) cells[i] = target;
    setGrid(cells.sort(() => Math.random() - 0.5));
  }, []);

  const onCell = async (idx) => {
    if (grid[idx].label === target.label) {
      const g = [...grid];
      g[idx] = { emoji: '✅', label: 'ok' };
      setGrid(g);
      setFound(f => f + 1);
      const anyLeft = g.some(c => c.label === target.label);
      if (!anyLeft) {
        Alert.alert('🏆 ¡Completado!', `Encontraste todos "${target.label}"`);
        if (userId && gameId) {
          try { await saveProgress({ userId, gameId }); } catch {}
        }
        navigation.replace(backScreen, { userId, username, categoria });
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFEB3B' }}>
      {/* Estrellas animadas tipo ColorsMixGame */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s, i) => (
          <Animated.View key={i} style={{ position: 'absolute', left: s.x, transform: [{ translateY: s.y }] }}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                fill="#FFF59D" opacity={0.4 + Math.random() * 0.6} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <View style={s.wrap}>
        <View style={s.header}>
          <Text style={s.brand}>SpeakUp</Text>
          <Text style={s.title}>House · Spot-It!</Text>
        </View>

        <View style={s.card}>
          <Text style={s.subtitle}>Find all: <Text style={s.bold}>{target.emoji} {target.label}</Text></Text>
          <View style={s.grid}>
            {grid.map((c, i) => (
              <SpotCell key={i} emoji={c.emoji} onPress={() => onCell(i)} />
            ))}
          </View>
          <Text style={s.footer}>Found: {found}</Text>
        </View>
      </View>
    </View>
  );
}

function SpotCell({ emoji, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 5 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={{ width: '31%', aspectRatio: 1 }}>
      <Animated.View style={[s.cell, { transform: [{ scale }] }]}>
        <View style={s.cellGloss} />
        <Text style={s.big}>{emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'flex-start' },
  header: { width: '100%', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  brand: { fontSize: 16, color: '#4e342e', fontFamily: 'Comic Sans MS' },
  title: { fontSize: 28, fontWeight: '900', color: '#FF6F00', fontFamily: 'Comic Sans MS', textShadowColor: '#fff9c4', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },

  card: { width: '100%', maxWidth: 520, backgroundColor: 'rgba(255,255,255,0.92)', padding: 18, borderRadius: 22, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3, alignItems: 'center' },
  subtitle: { fontSize: 16, color: '#5D4037', marginBottom: 12, fontFamily: 'Comic Sans MS' },
  bold: { fontWeight: '900', color: '#2E7D32', fontFamily: 'Comic Sans MS' },

  grid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10, rowGap: 10 },
  cell: { flex: 1, backgroundColor: '#FFF59D', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' },
  cellGloss: { position: 'absolute', top: 10, left: 12, width: 60, height: 20, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.4)' },
  big: { fontSize: 34 },

  footer: { marginTop: 10, color: '#3E2723', fontWeight: 'bold', fontFamily: 'Comic Sans MS' },
});