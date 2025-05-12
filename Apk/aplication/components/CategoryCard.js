import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

export default function CategoryCard({ title, description, sub, color, delay, onPress, locked }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const lockRef = useRef(null);

  const handlePressIn = () => {
    if (!locked) {
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!locked) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLockedPress = () => {
    if (locked && lockRef.current) {
      lockRef.current.shake(500);
    } else if (onPress) {
      onPress();
    }
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animatable.View animation="fadeInUp" delay={delay} style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: locked ? '#ccc' : color }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleLockedPress}
        activeOpacity={0.8}
      >
        {locked ? (
          <>
            <Animatable.View ref={lockRef}>
              <FontAwesome name="lock" size={32} color="#555" />
            </Animatable.View>
            <Text style={styles.lockedText}>Nivel requerido: Medio</Text>
          </>
        ) : (
          <>
            <Animated.Text style={[styles.title, animatedStyle]}>{title}</Animated.Text>
            <Animated.Text style={[styles.desc, animatedStyle]}>{description}</Animated.Text>
            {sub && (
              <Animated.Text
                style={[styles.sub, animatedStyle]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {sub}
              </Animated.Text>
            )}
          </>
        )}
      </TouchableOpacity>
    </Animatable.View>
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
    textAlign: 'center',
  },
  lockedText: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
