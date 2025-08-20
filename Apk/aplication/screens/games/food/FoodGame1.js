// screens/games/FoodMatchGame/FoodMatchGameScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function FoodGame1() {
  const items = [
    {
      id: 'apple',
      word: 'Apple',
      imageUri: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
    },
    {
      id: 'banana',
      word: 'Banana',
      imageUri: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
    },
    {
      id: 'burger',
      word: 'Burger',
      imageUri: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg',
    },
    {
      id: 'grapes',
      word: 'Grapes',
      imageUri: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Table_grapes_on_white.jpg',
    },
  ];

  const leftX = 20;
  const rightX = width - 80;
  const startY = 120;
  const spacing = 80;

  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [errorPos, setErrorPos] = useState(null);
  const [done, setDone] = useState(false);

  const handleWordPress = (item, idx) => {
    const y = startY + idx * spacing;
    setSelected({ id: item.id, x: leftX + 80, y });
  };

  const handleImagePress = (item, idx) => {
    const y = startY + idx * spacing;
    if (!selected) return;

    if (selected.id === item.id) {
      setLines([
        ...lines,
        {
          x1: selected.x,
          y1: selected.y,
          x2: rightX,
          y2: y,
        },
      ]);
      setMatchedIds([...matchedIds, item.id]);
      setSelected(null);
      if (matchedIds.length + 1 === items.length) {
        setDone(true);
      }
    } else {
      const midX = (selected.x + rightX) / 2;
      const midY = (selected.y + y) / 2;
      setErrorPos({ x: midX, y: midY });
      setTimeout(() => setErrorPos(null), 800);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setSelected(null);
    setLines([]);
    setMatchedIds([]);
    setErrorPos(null);
    setDone(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match the Food</Text>

      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.wordBtn, { top: startY + idx * spacing }]}
          onPress={() => handleWordPress(item, idx)}
          disabled={matchedIds.includes(item.id)}
        >
          <Text
            style={[
              styles.wordText,
              matchedIds.includes(item.id) && styles.strikethrough,
            ]}
          >
            {item.word}
          </Text>
        </TouchableOpacity>
      ))}

      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.imageBtn, { top: startY + idx * spacing }]}
          onPress={() => handleImagePress(item, idx)}
          disabled={matchedIds.includes(item.id)}
        >
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        </TouchableOpacity>
      ))}

      <Svg style={StyleSheet.absoluteFill}>
        {lines.map((ln, i) => (
          <Line
            key={i}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            stroke="green"
            strokeWidth="4"
          />
        ))}
      </Svg>

      {errorPos && (
        <Animatable.Text
          animation="shake"
          style={[styles.errorX, { left: errorPos.x - 12, top: errorPos.y - 12 }]}
        >
          ✗
        </Animatable.Text>
      )}

      <Modal visible={done} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Great Job!</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleRestart}>
              <Text style={styles.modalBtnText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// — ESTILOS —
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  wordBtn: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  wordText: {
    fontSize: 18,
    color: '#333',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  imageBtn: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  errorX: {
    position: 'absolute',
    fontSize: 28,
    color: 'red',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#388E3C',
  },
  modalBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
