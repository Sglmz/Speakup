import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedBackground from '../components/AnimatedBackground';
import * as Animatable from 'react-native-animatable';

export default function AdminPanelScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AnimatedBackground style={styles.animatedBackground} />

      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" delay={100}>
          <Icon name="shield-account" size={80} color="#F57C00" style={{ marginBottom: 30 }} />
        </Animatable.View>

        <Animatable.Text animation="fadeInDown" delay={300} style={styles.title}>
          Panel de Admin
        </Animatable.Text>

        <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
          Accede a funciones administrativas
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.progressBox}>
          <Text style={styles.progressText}>Usuarios, juegos, progreso...</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={1100}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Inicio')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: 'Comic Sans MS',
    fontSize: 40,
    color: '#F57C00',
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Comic Sans MS',
    fontSize: 18,
    color: '#444',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressBox: {
    backgroundColor: '#fffde7',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 35,
    marginBottom: 32,
    elevation: 2,
  },
  progressText: {
    color: '#F57C00',
    fontFamily: 'Comic Sans MS',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F57C00',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Comic Sans MS',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
