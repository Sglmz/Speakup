import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import { API_URL } from '../../../config';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function ColorGameIntro({ navigation, route }) {
  const userId = route?.params?.userId ?? null;
  const categoria = route?.params?.categoria ?? null;
  const username = route?.params?.username ?? '';
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [claseVista, setClaseVista] = useState(false);

  useEffect(() => {
    if (!userId || !categoria) return;
    fetch(`${API_URL}ver_progreso.php?userId=${userId}&categoria=${categoria}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === "success") setProgress(json.progress);
      })
      .catch(err => console.error("❌ Error progreso:", err))
      .finally(() => setLoading(false));
  }, [userId, categoria]);

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

  return (
    <View style={styles.container} key={route?.key}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.star, { left: s.x, transform: [{ translateY: s.translateY }] }]}>
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

      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" delay={100}>
          <Icon name="palette" size={80} color="#81C784" style={{ marginBottom: 30 }} />
        </Animatable.View>
        <Animatable.Text animation="fadeInDown" delay={300} style={styles.title}>
          Colores
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
          ¿Listo para aprender los colores en inglés?
        </Animatable.Text>
        <Animatable.View animation="fadeInUp" delay={800} style={styles.progressBox}>
          {loading
            ? <ActivityIndicator color="#388E3C" />
            : <Text style={styles.progressText}>Progreso: {progress}%</Text>
          }
        </Animatable.View>

        <Animatable.Text animation="fadeInUp" delay={900} style={styles.explicacion}>
          🎨 ¡Primero mira la clase! Después podrás jugar 🧠
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={1000}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#388E3C', marginBottom: 15 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.buttonText, { color: '#388E3C' }]}>Ver clase</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1200}>
          <TouchableOpacity
            style={[styles.button, { opacity: claseVista ? 1 : 0.4 }]}
            onPress={() =>
              claseVista &&
              navigation.replace('AllGamesScreenColors', { categoria, userId, username, progress })
            }
            disabled={!claseVista}
            activeOpacity={claseVista ? 0.85 : 1}
          >
            <Text style={styles.buttonText}>¡Empezar!</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <WebView
            javaScriptEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/-Wex5upBElE?autoplay=1&controls=1&modestbranding=1' }}
          />
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setClaseVista(true);
              setModalVisible(false);
            }}
          >
            <Icon name="check-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.modalBtnText}>¡Ya vi la clase, quiero jugar!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  title: { fontFamily: 'Comic Sans MS', fontSize: 40, color: '#388E3C', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  subtitle: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#444', marginBottom: 30, textAlign: 'center' },
  explicacion: { fontFamily: 'Comic Sans MS', fontSize: 18, color: '#222', textAlign: 'center', marginBottom: 15 },
  progressBox: { backgroundColor: '#fffde7', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 35, marginBottom: 25, elevation: 2 },
  progressText: { color: '#388E3C', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  button: { backgroundColor: '#388E3C', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 20, elevation: 3 },
  buttonText: { color: '#fff', fontFamily: 'Comic Sans MS', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
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
  star: { position: 'absolute', justifyContent: 'center', alignItems: 'center' }
});
