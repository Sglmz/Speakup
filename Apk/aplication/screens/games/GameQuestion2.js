// SopaDeLetras.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

function generarMatriz(words, size = 8) {
  // Matriz de letras vacía
  let matrix = Array(size).fill().map(() => Array(size).fill(''));
  // Coloca cada palabra en una fila aleatoria, en horizontal
  words.forEach((w, idx) => {
    let row = idx;
    let col = Math.floor(Math.random() * (size - w.en.length));
    for (let i = 0; i < w.en.length; i++) {
      matrix[row][col + i] = w.en[i].toUpperCase();
    }
  });
  // Rellena espacios vacíos con letras aleatorias
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c]) {
        matrix[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return matrix;
}

export default function SopaDeLetras({ words, onWordFound = () => {} }) {
  const [found, setFound] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupWord, setPopupWord] = useState(null);
  const matrix = generarMatriz(words);
  const [selected, setSelected] = useState([]);

  // Selección simple: usuario toca letras en fila para armar una palabra
  const handleCellPress = (row, col) => {
    const next = [...selected, { row, col }];
    // Limita selección a longitud máxima de palabra
    if (next.length > 8) return;
    setSelected(next);

    // Forma la palabra de las celdas seleccionadas
    const palabraFormada = next.map(({ row, col }) => matrix[row][col]).join('');
    const encontrada = words.find(w => 
      w.en.toUpperCase() === palabraFormada
      && !found.includes(w.en)
    );
    if (encontrada) {
      setFound([...found, encontrada.en]);
      setPopupWord(encontrada);
      setShowPopup(true);
      setSelected([]);
      onWordFound(encontrada);
    } else if (palabraFormada.length >= 8) {
      setSelected([]);
    }
  };

  return (
    <View style={styles.root}>
      {/* Lista de palabras */}
      <View style={styles.wordList}>
        {words.map((w, i) => (
          <Text
            key={w.en}
            style={[
              styles.wordItem,
              found.includes(w.en) && styles.wordFound
            ]}
          >
            {w.en} {found.includes(w.en) ? '✅' : ''}
          </Text>
        ))}
      </View>

      {/* Sopa de letras */}
      <View style={styles.grid}>
        {matrix.map((rowArr, row) => (
          <View key={row} style={{ flexDirection: 'row' }}>
            {rowArr.map((cell, col) => {
              const isSelected = selected.some(sel => sel.row === row && sel.col === col);
              const isFound = found.some(fword => {
                // Marca toda la palabra encontrada
                const idx = words.findIndex(w => w.en === fword);
                return idx === row && words[idx].en.indexOf(cell) !== -1;
              });
              return (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.cell,
                    isSelected && styles.cellSelected,
                    isFound && styles.cellFound,
                  ]}
                  onPress={() => handleCellPress(row, col)}
                  disabled={isFound}
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Popup animado */}
      <Modal transparent visible={showPopup} animationType="fade">
        <View style={styles.popupOverlay}>
          <Animatable.View animation="zoomIn" style={styles.popup}>
            <Text style={styles.popupWord}>{popupWord?.en}</Text>
            <Text style={styles.popupTrans}>{popupWord?.es}</Text>
            <TouchableOpacity
              onPress={() => setShowPopup(false)}
              style={styles.popupBtn}
            >
              <Text style={styles.popupBtnText}>¡OK!</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8E1' },
  wordList: { flexDirection: 'row', gap: 16, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' },
  wordItem: { fontSize: 20, fontWeight: 'bold', color: '#8d6200', backgroundColor: '#fff2a6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 4 },
  wordFound: { backgroundColor: '#C8F7C5', color: '#1b8c42' },
  grid: { borderRadius: 16, backgroundColor: '#FFECB3', padding: 8, elevation: 4 },
  cell: { width: width/11, height: width/11, alignItems: 'center', justifyContent: 'center', margin: 3, backgroundColor: '#FFF3E0', borderRadius: 8, borderWidth: 1, borderColor: '#ffd74b' },
  cellText: { fontSize: 22, fontWeight: 'bold', color: '#795548', fontFamily: 'Comic Sans MS' },
  cellSelected: { backgroundColor: '#FFF9C4', borderColor: '#FFD700', borderWidth: 2 },
  cellFound: { backgroundColor: '#C8F7C5', borderColor: '#13c26e' },
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.22)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: '#fff', borderRadius: 22, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 10 },
  popupWord: { fontSize: 32, fontWeight: 'bold', color: '#ff8c00', marginBottom: 12 },
  popupTrans: { fontSize: 22, color: '#4f2c04', marginBottom: 18 },
  popupBtn: { backgroundColor: '#ffe57f', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 8 },
  popupBtnText: { fontWeight: 'bold', color: '#8d6200', fontSize: 18 },
});
