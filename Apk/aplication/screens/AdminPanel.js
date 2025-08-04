import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Svg, { Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

const mockUsers = [
  { id: 1, nombre: 'Juan Pérez', ultimoIngreso: '5 de julio, 2025' },
  { id: 2, nombre: 'Ana Martínez', ultimoIngreso: '4 de julio, 2025' },
  { id: 3, nombre: 'Carlos Gómez', ultimoIngreso: '3 de julio, 2025' },
  { id: 4, nombre: 'Lucía Torres', ultimoIngreso: '1 de julio, 2025' },
  { id: 5, nombre: 'María Rodríguez', ultimoIngreso: '30 de junio, 2025' },
  { id: 6, nombre: 'Pedro Sánchez', ultimoIngreso: '29 de junio, 2025' },
  { id: 7, nombre: 'Elena López', ultimoIngreso: '28 de junio, 2025' },
  { id: 8, nombre: 'Tomás Rivera', ultimoIngreso: '27 de junio, 2025' },
  { id: 9, nombre: 'Paula Méndez', ultimoIngreso: '26 de junio, 2025' },
];

export default function AdminPanelScreen({ navigation }) {
  const [search, setSearch] = useState('');
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

  return (
    <View style={styles.container}>
      {/* Fondo animado de estrellas */}
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

      {/* Contenido principal */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Animatable.View animation="fadeInDown" delay={100} style={styles.header}>
          <Icon name="shield-account" size={80} color="#F57C00" />
          <Text style={styles.title}>Panel de Admin</Text>
          <Text style={styles.subtitle}>Accede a funciones administrativas</Text>
        </Animatable.View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar usuario..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.userList}>
          {mockUsers.map((user, index) => (
            <Animatable.View
              key={user.id}
              animation="fadeInUp"
              delay={400 + index * 100}
              style={styles.userCard}
            >
              <Text style={styles.userName}>{user.nombre}</Text>
              <Text style={styles.userLastSeen}>
                Última vez que ingresó: {user.ultimoIngreso}
              </Text>
              <TouchableOpacity style={styles.progressButton}>
                <Text style={styles.progressButtonText}>Ver Progreso</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEB3B',
    flex: 1,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 150,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: '120vh', // ✅ Scroll garantizado
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Comic Sans MS',
    fontSize: 34,
    color: '#F57C00',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginTop: 5,
  },
  searchBox: {
    backgroundColor: '#fffde7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 20,
    width: '100%',
    maxWidth: 600,
    elevation: 2,
  },
  searchInput: {
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    color: '#333',
  },
  userList: {
    width: '100%',
    maxWidth: 600,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },
  userName: {
    fontFamily: 'Comic Sans MS',
    fontSize: 20,
    color: '#F57C00',
    fontWeight: 'bold',
  },
  userLastSeen: {
    fontFamily: 'Comic Sans MS',
    fontSize: 14,
    color: '#777',
    marginVertical: 8,
  },
  progressButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F57C00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  progressButtonText: {
    color: '#fff',
    fontFamily: 'Comic Sans MS',
    fontSize: 14,
  },
});
