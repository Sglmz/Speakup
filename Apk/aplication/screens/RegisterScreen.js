// screens/RegisterScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function RegisterScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ===== Fondo animado =====
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => {
        const x = Math.random() * width;
        const startY = -50 - Math.random() * (height * 0.5);
        const translateY = new Animated.Value(startY);
        const speed = Math.random() * 5000 + 3000; // 3–8s
        const opacity = 0.3 + Math.random() * 0.7;
        const size = 60 + Math.floor(Math.random() * 60); // 60–120
        return { x, translateY, speed, opacity, size };
      }),
    []
  );

  useEffect(() => {
    stars.forEach(({ translateY, speed }) => {
      const animate = () => {
        translateY.setValue(-50 - Math.random() * (height * 0.5));
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: speed,
          useNativeDriver: true,
        }).start(animate);
      };
      animate();
    });
  }, [stars]);

  // ===== Helpers =====
  const validate = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Completa nombre, correo y contraseña.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Correo inválido', 'Ingresa un correo válido.');
      return false;
    }
    if (password.length < 4) {
      Alert.alert('Contraseña corta', 'Usa al menos 4 caracteres.');
      return false;
    }
    return true;
  };

  const goToLoginReset = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  // Intenta parsear JSON aunque el backend mande texto con espacios o HTML
  const readAsJsonTolerant = async (resp) => {
    const raw = await resp.text(); // siempre leo texto
    let data = null;
    try {
      data = JSON.parse(raw.trim());
    } catch (e) {
      // Si no era JSON, creo un objeto con el texto
      data = { message: raw };
    }
    return { data, raw };
  };

  const isSuccess = (data) => {
    const statusOk =
      typeof data?.status === 'string' &&
      data.status.toLowerCase() === 'success';
    const msgOk = typeof data?.message === 'string' &&
      /exitos[oa]|cread[oa]/i.test(data.message);
    return statusOk || msgOk;
  };

  // ===== Registro =====
  const handleRegister = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const resp = await fetch(`${API_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        Alert.alert('Error del servidor', txt?.slice(0, 300) || `HTTP ${resp.status}`);
        return;
      }

      const { data, raw } = await readAsJsonTolerant(resp);
      // Para depurar si hiciera falta:
      console.log('register.php ->', { data, raw });

      if (isSuccess(data)) {
        const msg = data?.message?.trim() || '¡Cuenta creada! Ahora inicia sesión.';
        if (Platform.OS === 'web') {
          window.alert(msg);
          goToLoginReset();
        } else {
          Alert.alert('¡Cuenta creada!', msg, [{ text: 'OK', onPress: goToLoginReset }]);
        }
      } else {
        const msg =
          (data && (data.message || data.error)) ||
          'No se pudo registrar. Intenta de nuevo.';
        Alert.alert('No se pudo registrar', String(msg).slice(0, 300));
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error de conexión', 'No se pudo contactar al servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container} key={route?.key}>
        {/* Fondo animado */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {stars.map((star, i) => (
            <Animated.View
              key={i}
              style={[
                styles.star,
                { left: star.x, transform: [{ translateY: star.translateY }] },
              ]}
            >
              <Svg height={star.size} width={star.size} viewBox="0 0 40 40">
                <Polygon
                  points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                  fill="#FFF59D"
                  opacity={star.opacity}
                />
              </Svg>
            </Animated.View>
          ))}
        </View>

        {/* Contenido */}
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
          ¡Crea tu cuenta con ayuda de tus padres!
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.inputContainer}>
          <Text style={styles.icon}>👤</Text>
          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor="#000"
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={750} style={styles.inputContainer}>
          <Text style={styles.icon}>✉️</Text>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#000"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={900} style={styles.inputContainer}>
          <Text style={styles.icon}>🔑</Text>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#000"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1150}>
          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Creando...' : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
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
  star: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 42, fontWeight: 'bold', fontFamily: 'Comic Sans MS', marginBottom: 10 },
  s: { color: '#FF5722' }, p: { color: '#FF5722' }, e: { color: '#F44336' },
  a: { color: '#2962FF' }, k: { color: '#ffffff' }, u: { color: '#FFAB00' }, p2: { color: '#FFAB00' },
  subtitle: { fontFamily: 'Comic Sans MS', fontSize: 14, marginBottom: 30, textAlign: 'center' },
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
  icon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontFamily: 'Comic Sans MS', fontSize: 16, paddingVertical: 10, color: '#000' },
  button: {
    backgroundColor: '#3F51B5',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Comic Sans MS' },
});
