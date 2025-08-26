import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Animated, Dimensions
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function UserPanelScreen({ route }) {
  const { username, userId } = route.params;
  const [progresoTotal, setProgresoTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/get_progreso.php?user_id=${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'error') return console.warn('⚠️ Error:', json);
        let completados = 0, total = 0;
        json.forEach(n => {
          completados += n.completados;
          total += n.total;
        });
        const porcentaje = total ? completados / total : 0;
        setProgresoTotal(porcentaje);
      })
      .catch(err => console.error('❌ Error al obtener progreso:', err))
      .finally(() => setLoading(false));
  }, [userId]);

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

  return (
    <View style={s.container}>
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={[s.star, { left: star.x, transform: [{ translateY: star.translateY }] }]}>
          <Svg height="100" width="100" viewBox="0 0 40 40">
            <Polygon
              points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
              fill="#FFF59D"
              opacity={0.3 + Math.random() * 0.7}
            />
          </Svg>
        </Animated.View>
      ))}

      <View style={s.overlay}>
        <Animatable.Text animation="fadeInDown" delay={200} style={s.title}>
          {username}
        </Animatable.Text>
        <Animatable.Text animation="fadeInDown" delay={400} style={s.description}>
          Bienvenido, este es tu progreso general:
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={600} style={s.progressContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF5722" />
          ) : (
            <>
              <Progress.Circle
                size={200}
                progress={progresoTotal}
                showsText
                formatText={() => `${Math.round(progresoTotal * 100)}%`}
                color="#FFAB00"
                borderWidth={3}
                thickness={16}
                unfilledColor="#fff"
                textStyle={s.percentageText}
              />
              <Text style={s.progressLabel}>Progreso Global</Text>
            </>
          )}
        </Animatable.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 2,
  },
  description: {
    fontFamily: 'Comic Sans MS',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  progressLabel: {
    marginTop: 18,
    fontFamily: 'Comic Sans MS',
    fontSize: 28,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  percentageText: {
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    fontSize: 42,
    color: '#222',
  },
});
