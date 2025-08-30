import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Animated, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Polygon, Svg } from 'react-native-svg';
import CategoryCard from '../components/CategoryCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function AllCategoriesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState([]);
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});
  const userId = route?.params?.userId ?? null;
  const username = route?.params?.username ?? '';

  // ⭐ estrellas animadas
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

  // 📡 cargar categorías + progreso
  useEffect(() => {
    fetch(`${API_URL}get_categories.php`)
      .then(r => r.json())
      .then(j => {
        if (j.status === "success") {
          setCategories(j.categories);
          j.categories.forEach(cat => {
            fetch(`${API_URL}ver_progreso.php?userId=${userId}&categoria=${cat.id}`)
              .then(res => res.json())
              .then(p => {
                if (p.status === "success") {
                  setProgressData(prev => ({ ...prev, [cat.id]: p.progress }));
                }
              });
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <View style={s.c} key={route?.key}>
      {/* Fondo estrellas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View
            key={i}
            style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}
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

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={s.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={s.t}>
          ¡Explora todas las categorías!
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View style={s.g}>
            {categories.map((cat, i) => {
              const isLocked = parseInt(cat.locked) === 1;
              return (
                <CategoryCard
                  key={cat.id}
                  title={cat.name}
                  description={cat.description}
                  sub={
                    isLocked
                      ? "🔒 Bloqueado"
                      : `Progreso: ${progressData[cat.id] ?? 0}%`
                  }
                  color={[
                    '#FFC3A0',
                    '#FFD700',
                    '#ADD8E6',
                    '#FFDAB9',
                    '#98FB98',
                    '#D3D3D3',
                    '#32CD32'
                  ][i % 7]}
                  delay={300 + i * 100}
                  locked={isLocked}
                  style={isLocked ? s.lockedCard : {}}
                  onPress={() => {
                    if (isLocked) return; // 🚫 no navega
                    const screen =
                      categoryScreens[cat.id] || 'WordsGameIntroScreen';
                    navigation.navigate(screen, {
                      userId,
                      username,
                      categoria: cat.id,
                      progress: progressData[cat.id] ?? 0
                    });
                  }}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B' },
  scroll: { alignItems: 'center', paddingBottom: 100 },
  t: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 30,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    letterSpacing: 2,
    transform: [{ rotate: '-0.5deg' }]
  },
  g: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  lockedCard: {
    opacity: 0.5 // 🔒 estilo visual para bloqueadas
  }
});
