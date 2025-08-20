import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';
import CategoryCard from '../components/CategoryCard';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

const categoryScreens = {
  1: 'AnimalGameIntro',
  2: 'ColorGameIntro',
  3: 'FoodGameIntroScreen',
  4: 'HouseGameIntro',
  5: 'LettersGameIntro',
  6: 'NumberGameIntro',
  7: 'WordsGameIntroScreen'
};


export default function HomeScreen({ navigation, route }) {
  const userId = route?.params?.userId ?? null;
  const username = route?.params?.username ?? '';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);

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

  useEffect(() => {
  fetch(`${API_URL}get_categories.php`)
    .then(res => res.json())
    .then(json => {
      if (json.status === "success") setCategories(json.categories);
    })
    .catch(err => console.error("❌ Error cargando categorías:", err))
    .finally(() => setLoading(false));
}, []);

  return (
    <View style={styles.c} key={route?.key}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s, i) => (
          <Animated.View key={i} style={[styles.s, { left: s.x, transform: [{ translateY: s.translateY }] }]}>
            <Svg height="100" width="100" viewBox="0 0 40 40">
              <Polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" fill="#FFF59D" opacity={0.3 + Math.random() * 0.7} />
            </Svg>
          </Animated.View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.sv}>
        <Animatable.Text animation="bounceInDown" delay={200} style={styles.logo}>
          {['S', 'P', 'E', 'A', 'K', 'U', 'P'].map((l, i) => (
            <Text key={i} style={[styles.l, styles[`c${i}`]]}>{l}</Text>
          ))}
        </Animatable.Text>

        <Animatable.Text animation="fadeIn" delay={600} style={styles.level}>
          Nivel actual: <Text style={styles.inicial}>Inicial</Text>
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View style={styles.grid}>
            {categories.slice(0, 5).map((cat, i) => (
              <CategoryCard
                key={cat.id}
                delay={800 + i * 200}
                title={cat.name}
                description={cat.description}
                sub={`Learn about ${cat.name.toLowerCase()}`}
                color={['#FFD54F', '#FF8A65', '#F48FB1', '#A1887F', '#81C784'][i % 5]}
                onPress={() => {
                  const screen = categoryScreens[cat.id] || 'WordsGameIntroScreen';
                  navigation.navigate(screen, { userId, username, categoria: cat.id });
                }}
              />
            ))}
          </View>
        )}

        <Animatable.View animation="fadeInUp" delay={600}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Todas', { userId, username })}>
            <Text style={styles.btnText}>Ver todas las categorías</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B' },
  sv: { alignItems: 'center', paddingTop: 80, paddingBottom: 100 },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  l: { fontSize: 60, fontFamily: 'Comic Sans MS' },
  c0: { color: '#ffab00' }, c1: { color: '#ffab00' }, c2: { color: '#ff3d00' },
  c3: { color: '#2962ff' }, c4: { color: '#fff' }, c5: { color: '#ffab00' }, c6: { color: '#ffab00' },
  logo: { flexDirection: 'row', marginBottom: 20 },
  level: { fontSize: 18, fontFamily: 'Comic Sans MS', color: '#4f2c04' },
  inicial: { fontWeight: 'bold', color: '#455A64' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: 10 },
  btn: { backgroundColor: '#3F51B5', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20, marginTop: 30 },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Comic Sans MS' }
});
