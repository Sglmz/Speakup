import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

export default function CategoryCard({ title, description, sub, color, delay, onPress, locked }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const lockRef = useRef(null);

  const handlePressIn = () => {
    if (!locked) {
      Animated.timing(scaleValue, {
        toValue: 1.05,
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
        activeOpacity={0.85}
      >
        {locked ? (
          <Animatable.View ref={lockRef} style={{ alignItems: 'center' }}>
            <FontAwesome name="lock" size={32} color="#555" />
            <Text style={styles.lockedText}>Nivel requerido: Medio</Text>
          </Animatable.View>
        ) : (
          <Animated.View style={[animatedStyle, styles.content]}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
              {description}
            </Text>
            {sub && (
              <Text
                style={styles.sub}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {sub}
              </Text>
            )}
          </Animated.View>
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
    height: 130,          // 🔹 Altura fija para simetría
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    textAlign: 'center',
  },
  lockedText: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});