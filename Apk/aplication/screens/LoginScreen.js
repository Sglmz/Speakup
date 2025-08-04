import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000,
    }));

    generatedStars.forEach(({ translateY, speed }) => {
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

    setStars(generatedStars);
  }, []);

  const handleLogin = () => {
    const email = username.toLowerCase();
    if (email === 'admin@speakup.com' && password === '1234') {
      navigation.replace('AdminPanel');
    } else {
      navigation.replace('Inicio');
    }
  };

  return (
    <View style={styles.container} key={route?.key}>
      {/* Fondo animado */}
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

      {/* Contenido de login */}
      <Animatable.Text animation="fadeInDown" delay={200} style={styles.logo}>
        <Text style={styles.s}>S</Text>
        <Text style={styles.p}>P</Text>
        <Text style={styles.e}>E</Text>
        <Text style={styles.a}>A</Text>
        <Text style={styles.k}>K</Text>
        <Text style={styles.u}>U</Text>
        <Text style={styles.p2}>P</Text>
      </Animatable.Text>

      <Animatable.Text animation="fadeInDown" delay={400} style={styles.subtitle}>
        Indícale a tus padres que te ayuden con estos datos
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={600} style={styles.inputContainer}>
        <Text style={styles.icon}>👤</Text>
        <TextInput
          placeholder="Nombre de usuario"
          placeholderTextColor="#000"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={750} style={styles.inputContainer}>
        <Text style={styles.icon}>🔑</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={950}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1150}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    marginBottom: 10,
  },
  s: { color: '#FF5722' },
  p: { color: '#FF5722' },
  e: { color: '#F44336' },
  a: { color: '#2962FF' },
  k: { color: '#ffffff' },
  u: { color: '#FFAB00' },
  p2: { color: '#FFAB00' },
  subtitle: {
    fontFamily: 'Comic Sans MS',
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '90%',
    elevation: 2,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  link: {
    color: '#000',
    fontFamily: 'Comic Sans MS',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3F51B5',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
});
