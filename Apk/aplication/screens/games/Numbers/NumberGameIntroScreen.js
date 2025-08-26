import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../../../config';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80;

export default function NumberGameIntroScreen({ navigation, route }) {
  const { userId, username, categoria = 6 } = route.params || {};
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [claseVista, setClaseVista] = useState(false);

  useEffect(() => {
    const gen = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));
    gen.forEach(({ translateY, speed }) => {
      const anim = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: speed,
          useNativeDriver: true
        }).start(anim);
      };
      anim();
    });
    setStars(gen);
  }, []);

  useEffect(() => {
    if (!userId || !categoria) {
      console.warn("⚠️ Faltan parámetros para ver el progreso");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}ver_progreso.php?userId=${userId}&categoria=${categoria}`)
      .then(res => res.json())
      .then(j => j.status === 'success' && setProgress(j.progress))
      .catch(e => console.error("❌ Error al cargar progreso:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={s.c} key={route?.key}>
      {/* Fondo animado */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View key={i} style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      {/* Contenido */}
      <View style={s.v}>
        <Animatable.View animation="fadeInDown" delay={100}>
          <Icon name="numeric-1" size={80} color="#81C784" style={{ marginBottom: 30 }} />
        </Animatable.View>

        <Animatable.Text animation="fadeInDown" delay={300} style={s.t}>Números</Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} style={s.st}>
          ¿Listo para aprender los números en inglés?
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={800} style={s.pb}>
          {loading
            ? <ActivityIndicator size="small" color="#388E3C" />
            : <Text style={s.pt}>Progreso: {progress}%</Text>}
        </Animatable.View>

        <Animatable.Text animation="fadeInUp" delay={900} style={s.explicacion}>
          🧠 ¡Primero mira la clase! Después podrás jugar 🎮
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={1000}>
          <TouchableOpacity
            style={[s.b, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#388E3C', marginBottom: 15 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[s.bt, { color: '#388E3C' }]}>Ver clase</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1200}>
          <TouchableOpacity
            style={[s.b, { opacity: claseVista ? 1 : 0.4 }]}
            onPress={() => claseVista && navigation.replace('AllGamesScreenNumbers', { userId, username, categoria, progress })}
            activeOpacity={claseVista ? 0.85 : 1}
            disabled={!claseVista}
          >
            <Text style={s.bt}>¡Empezar!</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {/* Modal con clase */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <WebView
            javaScriptEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/jMbRgtT7-5A?autoplay=1&controls=1&modestbranding=1' }}
          />
          <TouchableOpacity
            style={s.modalBtn}
            onPress={() => {
              setClaseVista(true);
              setModalVisible(false);
            }}
          >
            <Icon name="check-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
            <Text style={s.modalBtnText}>¡Ya vi la clase, quiero jugar!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B', justifyContent: 'center', alignItems: 'center' },
  v: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  t: { fontFamily: 'Comic Sans MS', fontSize: 40, color: '#388E3C', fontWeight: 'bold', marginBottom: 12 },
  st: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#444', marginBottom: 30, textAlign: 'center' },
  explicacion: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#222', textAlign: 'center', marginBottom: 15 },
  pb: { backgroundColor: '#fffde7', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 35, marginBottom: 25, elevation: 2 },
  pt: { color: '#388E3C', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  b: { backgroundColor: '#388E3C', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 20, elevation: 3 },
  bt: { color: '#fff', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  modalBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
  },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' }
});
