import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

export default function CategoryCard({ title, description, sub, color, delay, onPress }) {
  // Creamos una referencia para la animación de escala
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Función para aumentar el tamaño de la tarjeta cuando el usuario presiona
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Función para restaurar el tamaño original de la tarjeta
  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Estilos animados
  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animated.View
      // Usamos Animated.View para aplicar las animaciones
      animation="zoomIn"
      delay={delay}
      style={styles.wrapper}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress} // Evento al presionar la tarjeta
        activeOpacity={0.8}
      >
        <Animated.Text style={[styles.title, animatedStyle]}>{title}</Animated.Text>
        <Animated.Text style={[styles.desc, animatedStyle]}>{description}</Animated.Text>
        {sub && <Animated.Text style={[styles.sub, animatedStyle]} numberOfLines={2} ellipsizeMode="tail">{sub}</Animated.Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
  },
  card: {
    width: 150,
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
  },
  sub: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center', // Asegura que el texto esté centrado
  },
});
