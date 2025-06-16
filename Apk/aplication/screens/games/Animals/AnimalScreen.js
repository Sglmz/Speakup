import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GameQuestion from '../GameQuestion1';
import AnimatedBackground from '../../../components/AnimatedBackground';
import * as Animatable from 'react-native-animatable';

// Diccionario de traducciones
const optionMeanings = {
  Dog: 'Perro',
  Pineapple: 'Piña',
  Orange: 'Naranja',
  Book: 'Libro',
};

export default function AnimalGameScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Se ejecuta cuando se responde (GameQuestion1 debe llamar a esto)
  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setModalVisible(true);
  };

  // Guarda la opción seleccionada
  const handleOptionSelect = (option) => {
    setSelected(option);
  };

  // Al cerrar el popup, si está correcto navega a AnimalScreen2
  const handleContinue = () => {
    setModalVisible(false);
    if (isCorrect) {
      navigation.replace('AnimalScreen2'); // Asegúrate que este es el nombre en tu navigator
    } else {
      setSelected('');
    }
  };

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <GameQuestion
        question="¿Cómo se llama este animal?"
        image={require('../../../assets/dog.gif')}
        options={['Dog', 'Pineapple', 'Orange', 'Book']}
        correctAnswer="Dog"
        onAnswer={handleAnswer}
        onSelect={handleOptionSelect}
        bgColor="transparent"
        selected={selected}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={[
              styles.popup,
              isCorrect ? styles.correct : styles.incorrect,
            ]}
          >
            <Text style={styles.wordSelected}>
              {selected
                ? `${selected} significa ${optionMeanings[selected] || '---'}`
                : ''}
            </Text>
            <Text style={styles.msg}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto, intenta de nuevo'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleContinue}>
              <Text style={styles.btnText}>
                {isCorrect ? 'Continuar' : 'Reintentar'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  animatedBackground: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.21)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 26,
    alignItems: 'center',
    width: 300,
    elevation: 10,
    shadowColor: '#222',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  correct: { backgroundColor: '#C8F7C5', borderColor: '#13c26e', borderWidth: 3 },
  incorrect: { backgroundColor: '#ffb3b3', borderColor: '#c21b13', borderWidth: 3 },
  wordSelected: {
    fontSize: 24,
    color: '#ff8c00',
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  msg: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#333',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#ffe57f',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 5,
  },
  btnText: {
    color: '#8d6200',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
