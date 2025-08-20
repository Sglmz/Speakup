import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Animated, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Polygon, Svg } from 'react-native-svg';
import CategoryCard from '../components/CategoryCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../config';

const { width, height } = Dimensions.get('window'), STAR_COUNT = 80;

export default function AllCategoriesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets(), [categories, setCategories] = useState([]), [loading, setLoading] = useState(true), [stars, setStars] = useState([]);
  const userId = route?.params?.userId ?? null, username = route?.params?.username ?? '';

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
    .then(json => json.status === "success" && setCategories(json.categories))
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

      <ScrollView style={{ flex: 1, paddingTop: insets.top }} contentContainerStyle={styles.scroll}>
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.t}>¡Explora todas las categorías!</Animatable.Text>
        {loading ? <ActivityIndicator size="large" color="#000" /> : (
          <View style={styles.g}>
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                title={cat.name}
                description={cat.description}
                sub={`Aprende ${cat.name.toLowerCase()}`}
                color={['#FFC3A0','#FFD700','#ADD8E6','#FFDAB9','#98FB98','#D3D3D3','#32CD32'][i % 7]}
                delay={300 + i * 100}
                locked={cat.locked === 1}
                onPress={() => navigation.navigate('WordsGameIntroScreen', { userId, username, categoria: cat.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B' },
  scroll: { alignItems: 'center', paddingBottom: 100 },
  t: { fontSize: 32, fontWeight: 'bold', color: '#FF4081', marginBottom: 30, fontFamily: 'Comic Sans MS', textAlign: 'center', letterSpacing: 2, transform: [{ rotate: '-0.5deg' }] },
  g: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: 10 },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' }
});
