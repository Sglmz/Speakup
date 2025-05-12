import React, { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 80;

export default function AnimatedBackground() {
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    translateY: new Animated.Value(-50 - Math.random() * height), // Usar translateY en lugar de y
    speed: Math.random() * 5000 + 3000,
  }));

  useEffect(() => {
    stars.forEach(({ translateY, speed }) => {
      const animateStar = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5); // Reiniciar la posición translateY
        Animated.timing(translateY, {
          toValue: height + 50, // Animar translateY
          duration: speed,
          useNativeDriver: true,
        }).start(animateStar);
      };

      animateStar();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.starContainer,
            {
              transform: [{ translateY: star.translateY }], // Aplicar translateY a la transformación
              left: star.x,
            },
          ]}
        >
          <Svg height="100" width="100" viewBox="0 0 40 40">
            <Polygon
              points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
              fill="#FFF59D"
              opacity={0.3 + Math.random() * 0.7}
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});