import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { API_URL } from '../../../config';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80;

export default function HouseGameIntro({ navigation, route }) {
  const userId = route?.params?.userId ?? null;
  const username = route?.params?.username ?? '';
  const categoria = route?.params?.categoria ?? null;
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [claseVista, setClaseVista] = useState(false);

  // 🌟 Estrellas animadas
  useEffect(() => {
    const gen = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      translateY: new Animated.Value(-50 - Math.random() * height),
      speed: Math.random() * 5000 + 3000
    }));
    gen.forEach(({ translateY, speed }) => {
      const anim = () => {
        translateY.setValue(-50 - Math.random() * height * 0.5);
        Animated.timing(translateY, { toValue: height + 50, duration: speed, useNativeDriver: true }).start(anim);
      };
      anim();
    });
    setStars(gen);
  }, []);

  // 📊 Obtener progreso
  useEffect(() => {
    if (!userId || !categoria) {
      console.warn('⚠️ Faltan datos en HouseGameIntro:', route?.params);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}ver_progreso.php?userId=${userId}&categoria=${categoria}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === "success") {
          setProgress(parseInt(json.progress, 10) || 0);
        } else {
          console.warn("⚠️ Error en progreso:", json.message);
        }
      })
      .catch(err => console.error("❌ Error al obtener progreso:", err))
      .finally(() => setLoading(false));
  }, [userId, categoria]);

  return (
    <View style={s.c} key={route?.key}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View key={i} style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <View style={s.v}>
        <Animatable.View animation="fadeInDown" delay={100}>
          <Icon name="home-outline" size={80} color="#6D4C41" style={{ marginBottom: 30 }} />
        </Animatable.View>

        <Animatable.Text animation="fadeInDown" delay={300} style={s.t}>La Casa</Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} style={s.sT}>
          ¿Listo para aprender las partes de la casa en inglés?
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={800} style={s.pB}>
          {loading
            ? <ActivityIndicator size="small" color="#6D4C41" />
            : <Text style={s.pT}>Progreso: {progress}%</Text>}
        </Animatable.View>

        <Animatable.Text animation="fadeInUp" delay={900} style={s.explicacion}>
          🏡 ¡Primero mira la clase! Después podrás jugar 🎮
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={1000}>
          <TouchableOpacity
            style={[s.b, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#6D4C41', marginBottom: 15 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[s.bT, { color: '#6D4C41' }]}>Ver clase</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1200}>
          <TouchableOpacity
            style={[s.b, { opacity: claseVista ? 1 : 0.4 }]}
            onPress={() => claseVista && navigation.replace('AllHouseGamesScreen', { userId, username, progress, categoria })}
            activeOpacity={claseVista ? 0.85 : 1}
            disabled={!claseVista}
          >
            <Text style={s.bT}>¡Empezar!</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <WebView
            javaScriptEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/2wvRDESHpHU?autoplay=1&controls=1&modestbranding=1' }}
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
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  v: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  t: { fontFamily: 'Comic Sans MS', fontSize: 40, color: '#6D4C41', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  sT: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#444', marginBottom: 30, textAlign: 'center' },
  explicacion: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#222', textAlign: 'center', marginBottom: 15 },
  pB: { backgroundColor: '#fffde7', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 35, marginBottom: 25, elevation: 2 },
  pT: { color: '#6D4C41', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  b: { backgroundColor: '#6D4C41', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 20, elevation: 3 },
  bT: { color: '#fff', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
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
  }
});
