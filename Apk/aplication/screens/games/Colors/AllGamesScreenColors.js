import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Animated, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../../../components/CategoryCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { API_URL } from '../../../config';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

export default function AllGamesScreenColors({ route, navigation }) {
  const { userId, username, categoria } = route?.params || {};
  const insets = useSafeAreaInsets();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState([]);

  // ⭐ Animación de estrellas
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

  // 📡 Fetch juegos de la categoría
  useEffect(() => {
    if (!categoria) return console.warn("⚠️ Falta category_id");
    fetch(`${API_URL}get_games.php?category_id=${categoria}`)
      .then(r => r.json())
      .then(j => {
        if (j.status === "success") {
          console.log("🎮 Juegos recibidos:", j.games);
          setGames(j.games.slice(0, 5));
        } else {
          console.warn("⚠️ Error:", j.message);
        }
      })
      .catch(e => console.error("❌ Error de red:", e))
      .finally(() => setLoading(false));
  }, [categoria]);

  if (!userId || !username || !categoria) {
    console.warn("⚠️ Faltan parámetros: ", { userId, username, categoria });
    return null;
  }

  return (
    <View style={s.c} key={route?.key}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((s_, i) => (
          <Animated.View key={i} style={[s.s, { left: s_.x, transform: [{ translateY: s_.translateY }] }]}>
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

      <ScrollView style={{ flex: 1, paddingTop: insets.top }} contentContainerStyle={s.sv}>
        <Animatable.Text animation="fadeInUp" delay={200} style={s.t}>
          ¡Escoje un juego y diviértete aprendiendo!
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View style={s.g}>
            {games.map((game, i) => (
              <CategoryCard
                key={game.id}
                title={game.name}
                description={game.description}
                sub={game.description}
                color={['#4DB6AC', '#81C784', '#BA68C8', '#FF7043', '#64B5F6'][i % 5]}
                delay={100 + i * 200}
                onPress={() => {
                  if (!game.ruta) {
                    return console.warn(`⚠️ No se encontró ruta para game.id=${game.id}`);
                  }
                  navigation.navigate(game.ruta, {
                    userId,
                    username,
                    gameId: game.id,
                    categoria
                  });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B' },
  sv: { alignItems: 'center', paddingBottom: 100 },
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
  g: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: 10 },
  s: { position: 'absolute', justifyContent: 'center', alignItems: 'center' }
});
