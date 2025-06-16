import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AnimatedBackground from '../../../components/AnimatedBackground';

const { width } = Dimensions.get('window');
const GRID_SIZE = 7; // Puedes cambiar el tamaño según tu preferencia

const CELL_SIZE = Math.floor((width * 0.92) / GRID_SIZE); // 92% del ancho total

const WORDS = [
  { en: 'DOG', es: 'Perro' },
  { en: 'CAT', es: 'Gato' },
  { en: 'BIRD', es: 'Pájaro' },
  { en: 'COW', es: 'Vaca' },
];

// --- GENERA MATRIZ SOLO CON PALABRAS POSIBLES ---
function generarMatriz(words, size) {
  let matrix = Array(size).fill().map(() => Array(size).fill(''));
  let occupied = Array(size).fill().map(() => Array(size).fill(false));
  words.forEach((w, idx) => {
    let word = w.en;
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 50) {
      attempts++;
      // Dirección aleatoria: 0=horizontal, 1=vertical, 2=diagonal principal, 3=diagonal secundaria
      const dir = Math.floor(Math.random() * 4);
      let row, col;
      if (dir === 0) { // Horizontal
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * (size - word.length + 1));
        // Verifica espacio libre
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (occupied[row][col + i]) canPlace = false;
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            matrix[row][col + i] = word[i];
            occupied[row][col + i] = true;
          }
          placed = true;
        }
      } else if (dir === 1) { // Vertical
        col = Math.floor(Math.random() * size);
        row = Math.floor(Math.random() * (size - word.length + 1));
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (occupied[row + i][col]) canPlace = false;
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            matrix[row + i][col] = word[i];
            occupied[row + i][col] = true;
          }
          placed = true;
        }
      } else if (dir === 2) { // Diagonal principal \
        row = Math.floor(Math.random() * (size - word.length + 1));
        col = Math.floor(Math.random() * (size - word.length + 1));
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (occupied[row + i][col + i]) canPlace = false;
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            matrix[row + i][col + i] = word[i];
            occupied[row + i][col + i] = true;
          }
          placed = true;
        }
      } else if (dir === 3) { // Diagonal secundaria /
        row = Math.floor(Math.random() * (size - word.length + 1));
        col = Math.floor(Math.random() * (size - word.length + 1));
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (occupied[row + i][col + word.length - 1 - i]) canPlace = false;
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            matrix[row + i][col + word.length - 1 - i] = word[i];
            occupied[row + i][col + word.length - 1 - i] = true;
          }
          placed = true;
        }
      }
    }
    // Si no se pudo poner después de 50 intentos, se ignora
  });
  // Letras aleatorias para espacios vacíos
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c]) {
        matrix[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return matrix;
}

function getCellsBetween(start, end) {
  const cells = [];
  const dx = Math.sign(end.col - start.col);
  const dy = Math.sign(end.row - start.row);
  const steps = Math.max(Math.abs(end.col - start.col), Math.abs(end.row - start.row));
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + dy * i, col: start.col + dx * i });
  }
  return cells;
}

export default function AnimalScreen2() {
  const matrix = useRef(generarMatriz(WORDS, GRID_SIZE)).current;
  const [firstCell, setFirstCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [foundWord, setFoundWord] = useState(null);

  function handleCellPress(row, col) {
    if (!firstCell) {
      setFirstCell({ row, col });
      setSelectedCells([{ row, col }]);
    } else {
      const dx = Math.abs(col - firstCell.col);
      const dy = Math.abs(row - firstCell.row);
      if (dx === dy || dx === 0 || dy === 0) {
        const cells = getCellsBetween(firstCell, { row, col });
        setSelectedCells(cells);
        checkWord(cells);
      } else {
        setFirstCell(null);
        setSelectedCells([]);
      }
      setFirstCell(null);
    }
  }

  function checkWord(cells) {
    const wordArr = cells.map(({ row, col }) => matrix[row][col]);
    const word = wordArr.join('');
    const revWord = wordArr.slice().reverse().join('');
    const found = WORDS.find(
      w =>
        !foundWords.includes(w.en) &&
        (word === w.en || revWord === w.en) &&
        wordArr.length === w.en.length
    );
    if (found) {
      setFoundWords(prev => [...prev, found.en]);
      setFoundWord(found);
      setShowPopup(true);
    }
    setTimeout(() => setSelectedCells([]), 300);
  }

  function closePopup() {
    setShowPopup(false);
    setFoundWord(null);
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground style={StyleSheet.absoluteFillObject} />
      <Animatable.Text animation="fadeInDown" style={styles.header}>
        Juego de Animales 2
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" delay={300} style={styles.title}>
        ¡Encuentra las palabras!
      </Animatable.Text>
      <View style={styles.wordList}>
        {WORDS.map(w => (
          <Text
            key={w.en}
            style={[
              styles.wordItem,
              foundWords.includes(w.en) && styles.wordFound
            ]}
          >
            {w.en} {foundWords.includes(w.en) ? '✅' : ''}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {matrix.map((rowArr, row) => (
          <View key={row} style={{ flexDirection: 'row' }}>
            {rowArr.map((cell, col) => {
              const isSelected = selectedCells.some(sel => sel.row === row && sel.col === col);
              const isFound = foundWords.some(word => {
                const w = WORDS.find(w => w.en === word);
                if (!w) return false;
                // Checar horizontal, vertical, diagonal
                let found = false;
                // Horizontal
                let arr = matrix[row].join('');
                let idx = arr.indexOf(w.en);
                if (idx !== -1 && col >= idx && col < idx + w.en.length) found = true;
                // Vertical
                arr = matrix.map(r => r[col]).join('');
                idx = arr.indexOf(w.en);
                if (idx !== -1 && row >= idx && row < idx + w.en.length) found = true;
                // Diagonal principal
                for (let d = -GRID_SIZE + 1; d < GRID_SIZE; d++) {
                  let diag = [];
                  for (let r = 0; r < GRID_SIZE; r++) {
                    let c = r + d;
                    if (c >= 0 && c < GRID_SIZE) diag.push(matrix[r][c]);
                  }
                  arr = diag.join('');
                  idx = arr.indexOf(w.en);
                  if (idx !== -1) {
                    for (let i = 0; i < w.en.length; i++) {
                      if (row === d + idx + i && col === idx + i) found = true;
                    }
                  }
                }
                // Diagonal secundaria
                for (let d = 0; d < GRID_SIZE * 2; d++) {
                  let diag = [];
                  for (let r = 0; r < GRID_SIZE; r++) {
                    let c = d - r;
                    if (c >= 0 && c < GRID_SIZE) diag.push(matrix[r][c]);
                  }
                  arr = diag.join('');
                  idx = arr.indexOf(w.en);
                  if (idx !== -1) {
                    for (let i = 0; i < w.en.length; i++) {
                      if (row === idx + i && col === d - (idx + i)) found = true;
                    }
                  }
                }
                return found;
              });
              return (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.cell,
                    isSelected && styles.cellSelected,
                    isFound && styles.cellFound,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleCellPress(row, col)}
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      {showPopup && (
        <View style={styles.popupOverlay}>
          <Animatable.View animation="zoomIn" style={styles.popup}>
            <Text style={styles.popupWord}>{foundWord?.en}</Text>
            <Text style={styles.popupTrans}>{foundWord?.es}</Text>
            <TouchableOpacity
              onPress={closePopup}
              style={styles.popupBtn}
            >
              <Text style={styles.popupBtnText}>¡OK!</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', alignItems: 'center', paddingTop: 16, justifyContent: 'flex-start' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
    fontFamily: 'Comic Sans MS',
    marginTop: 16,
    marginBottom: 6,
    backgroundColor: '#fffacd',
    paddingHorizontal: 28,
    paddingVertical: 6,
    borderRadius: 16,
    textAlign: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF4081',
    fontFamily: 'Comic Sans MS',
    backgroundColor: '#fffacd',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    textAlign: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  wordList: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' },
  wordItem: { fontSize: 16, fontWeight: 'bold', color: '#8d6200', backgroundColor: '#fff2a6', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, marginBottom: 2 },
  wordFound: { backgroundColor: '#C8F7C5', color: '#1b8c42', textDecorationLine: 'line-through' },
  grid: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 3,
    marginTop: 10,
    marginBottom: 18,
    elevation: 4,
    alignSelf: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    backgroundColor: '#fffbe7',
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: '#FFD54F',
  },
  cellText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#795548',
    fontFamily: 'Comic Sans MS',
  },
  cellSelected: { backgroundColor: '#FFE082', borderColor: '#FFA000', borderWidth: 2 },
  cellFound: { backgroundColor: '#C8F7C5', borderColor: '#13c26e', borderWidth: 2 },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  popup: { backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 12 },
  popupWord: { fontSize: 28, fontWeight: 'bold', color: '#ff8c00', marginBottom: 10, fontFamily: 'Comic Sans MS' },
  popupTrans: { fontSize: 19, color: '#4f2c04', marginBottom: 13, fontFamily: 'Comic Sans MS' },
  popupBtn: { backgroundColor: '#ffe57f', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 7, marginTop: 4 },
  popupBtnText: { fontWeight: 'bold', color: '#8d6200', fontSize: 16 },
});
