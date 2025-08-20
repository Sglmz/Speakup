import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import FindObjectsTemplate from '../../../components/FindObjectsTemplate';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function FoundObjectsScreen() {
  // --- Generación de estrellas ----
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
    }));

    generated.forEach(({ translateY, speed }) => {
      const animate = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: speed,
          useNativeDriver: true,
        }).start(animate);
      };
      animate();
    });

    setStars(generated);
  }, []);

  // --- Datos de los objetos ---
  const items = [
    {
      id: 'bench',
      name: 'Bench',
      icon: require('../../../assets/canvas-img/bench.png'),
      x: '60%',
      y: '50%',
    },
    {
      id: 'book',
      name: 'Book',
      icon: require('../../../assets/canvas-img/book.png'),
      x: '50%',
      y: '80%',
    },
    {
      id: 'duck',
      name: 'Duck',
      icon: require('../../../assets/canvas-img/duck.png'),
      x: '20%',
      y: '30%',
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: require('../../../assets/canvas-img/apple.png'),
      x: '70%',
      y: '40%',
    },
  ];

  return (
    <View style={styles.container}>

      {/* Fondo animado de estrellas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((star, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                left: star.x,
                transform: [{ translateY: star.translateY }],
              },
            ]}
          >
            <Svg height="40" width="40" viewBox="0 0 40 40">
              <Polygon
                points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                fill="#FFF59D"
                opacity={0.3 + Math.random() * 0.7}
              />
            </Svg>
          </Animated.View>
        ))}
      </View>

      {/* Tu plantilla de “Encuentra los objetos” */}
      <FindObjectsTemplate
        title="Encuentra los objetos"
        backgroundImage={require('../../../assets/canvas-img/park_scene.png')}
        items={items}
        onComplete={() => console.log('¡EXCELENTE!')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B', // mismo color que tu ejemplo
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});