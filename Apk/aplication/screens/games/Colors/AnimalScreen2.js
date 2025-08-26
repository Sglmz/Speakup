// ColorMatch.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, Modal, TouchableOpacity, Alert,
  Animated, Dimensions, StyleSheet, BackHandler
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { API_URL } from '../../../config';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80;
const COLORS = [
  { id: '1', value: 'RED', type: 'text', pairId: 'red' }, { id: '2', value: 'red', type: 'color', pairId: 'red' },
  { id: '3', value: 'BLUE', type: 'text', pairId: 'blue' }, { id: '4', value: 'blue', type: 'color', pairId: 'blue' },
  { id: '5', value: 'GREEN', type: 'text', pairId: 'green' }, { id: '6', value: 'green', type: 'color', pairId: 'green' },
  { id: '7', value: 'YELLOW', type: 'text', pairId: 'yellow' }, { id: '8', value: 'yellow', type: 'color', pairId: 'yellow' }
];
const TRAD = { red: 'rojo', blue: 'azul', green: 'verde', yellow: 'amarillo' };
const shuffle = arr => [...arr].map(i => ({ ...i, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort).map(({ sort, ...i }) => i);

export default function ColorMatch() {
  const { userId, categoria, gameId, username } = useRoute().params;
  const navigation = useNavigation();
  const [cards, setCards] = useState([]), [sel, setSel] = useState([]), [match, setMatch] = useState([]),
    [modal, setModal] = useState(false), [ok, setOk] = useState(null), [lives, setLives] = useState(3),
    [stars, setStars] = useState([]), [completed, setCompleted] = useState(false);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false }),
    ])).start();
    setCards(shuffle(COLORS));
    const s = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
    }));
    s.forEach(({ y, speed }) => {
      const a = () => {
        y.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(y, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(a);
      };
      a();
    });
    setStars(s);
  }, []);

  useEffect(() => {
    if (sel.length === 2) {
      const [a, b] = sel, correct = a.pairId === b.pairId && a.type !== b.type;
      setTimeout(() => {
        setOk(correct);
        setModal(true);
        if (correct) setMatch(p => [...p, a.id, b.id]);
        else setLives(l => Math.max(0, l - 1));
        setSel([]);
      }, 500);
    }
  }, [sel]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (completed) return true;
      return false;
    });
    return () => backHandler.remove();
  }, [completed]);

  const handlePress = c => {
    if (sel.length < 2 && !sel.some(i => i.id === c.id) && !match.includes(c.id)) setSel([...sel, c]);
  };

  const closeModal = () => {
    setModal(false);
    if (lives <= 0) {
      Alert.alert('Fin del juego', 'Te has quedado sin vidas.');
      setTimeout(() => navigation.replace('AllGamesScreenColors', { userId, categoria, username }), 500);
    } else if (match.length === COLORS.length && !completed) {
      setCompleted(true);
      fetch(`${API_URL}guardar_progreso.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId })
      })
        .then(res => res.json())
        .then(json => {
          if (json.status === 'success') {
            navigation.replace('AllGamesScreenColors', { userId, categoria, username });
          } else {
            throw new Error(json.message);
          }
        })
        .catch(err => {
          console.error('Error al guardar progreso:', err);
          Alert.alert('Error', 'No se pudo guardar el progreso.');
          setCompleted(false);
        });
    }
  };

  const renderItem = ({ item }) => {
    const matched = match.includes(item.id), selected = sel.some(i => i.id === item.id);
    return (
      <Animatable.View animation={selected ? 'pulse' : 'bounceIn'} duration={600} iterationCount={selected ? 'infinite' : 1} style={{ width: '48%' }}>
        <TouchableOpacity disabled={matched} onPress={() => handlePress(item)} style={[styles.card,
        { backgroundColor: item.type === 'color' ? item.value : selected ? '#ffe082' : '#FFD54F' },
        matched && styles.correct, selected && styles.selected]}>
          {item.type === 'text' && <Text style={[styles.text, { color: matched ? item.value : '#4e342e' }]}>{item.value}</Text>}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const traducir = id => TRAD[id] || '';
  const palabra = sel[0]?.type === 'text' ? sel[0]?.value.toLowerCase() : sel[1]?.value.toLowerCase();
  const traduccion = traducir(sel[0]?.pairId || sel[1]?.pairId);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.star, { left: s.x, transform: [{ translateY: s.y }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>
      <Animated.Text style={[styles.title, { backgroundColor: glow.interpolate({ inputRange: [0, 1], outputRange: ['#ffa94d', '#fff59d'] }) }]}>Empareja el color con su nombre</Animated.Text>
      <Text style={styles.lives}>❤️ Vidas: {lives}</Text>
      <FlatList data={cards} renderItem={renderItem} keyExtractor={i => i.id} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} />
      <Modal visible={modal} transparent animationType="fade">
        <View style={styles.overlay}>
          <Animatable.View animation="zoomIn" duration={400} style={[styles.popup, ok ? styles.correct : styles.incorrect]}>
            {ok && <Text style={styles.msg}>¡Bien! <Text style={{ color: '#333' }}>{palabra}</Text> significa <Text style={{ fontWeight: 'bold' }}>{traduccion}</Text></Text>}
            <Text style={styles.msg}>{ok ? '¡Correcto! 🎉' : 'Ups, intenta otra vez.'}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.btn}>
              <Text style={styles.btnText}>{lives <= 0 ? 'Reintentar' : (match.length === COLORS.length ? 'Volver' : 'Continuar')}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  star: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#4f2c04',
    fontFamily: 'Comic Sans MS', padding: 12, borderRadius: 14, elevation: 2, alignSelf: 'center'
  },
  lives: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 },
  card: { borderRadius: 16, paddingVertical: 10, alignItems: 'center', marginTop: 25, height: 80, justifyContent: 'center', elevation: 2 },
  text: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Comic Sans MS', textAlign: 'center' },
  correct: { shadowColor: '#13c26e', shadowOpacity: 0.7, shadowRadius: 12, elevation: 8 },
  selected: { borderWidth: 2, borderColor: '#FFB300', shadowColor: '#FFD700', shadowOpacity: 0.8, shadowRadius: 10, elevation: 6 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.21)', alignItems: 'center', justifyContent: 'center' },
  popup: {
    backgroundColor: '#fff', padding: 32, borderRadius: 26, alignItems: 'center', width: 300, elevation: 10,
    shadowColor: '#222', shadowOpacity: 0.15, shadowRadius: 8
  },
  incorrect: { backgroundColor: '#ffb3b3', borderColor: '#c21b13', borderWidth: 3 },
  msg: { fontSize: 19, fontWeight: 'bold', marginBottom: 14, color: '#333', textAlign: 'center' },
  btn: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 },
  btnText: { color: '#8d6200', fontWeight: 'bold', fontSize: 18 }
});
