import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';

export default function UserPanelScreen(route) {
  const nivelFacil = 0.8; // 80%
  const nivelMedio = 0.55; // 55%

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animatable.Text animation="fadeInDown" delay={200} style={styles.titulo}>
          USUARIO
        </Animatable.Text>

        <Animatable.Text animation="fadeInDown" delay={400} style={styles.descripcion}>
          ESTE ES EL PANEL DEL NIÑO DONDE VA VER SU PORCENTAJE DE LOS 2 NIVELES
        </Animatable.Text>

        <View style={styles.graficosContainer}>
          <Animatable.View animation="fadeInUp" delay={600} style={styles.grafico}>
            <Progress.Circle
              size={220}
              progress={nivelFacil}
              showsText={true}
              formatText={() => `${Math.round(nivelFacil * 100)}%`}
              color="#FFAB00"
              borderWidth={3}
              thickness={16}
              unfilledColor="#fff"
              textStyle={{
                fontFamily: 'Comic Sans MS',
                fontWeight: 'bold',
                fontSize: 42,
                color: '#222'
              }}
            />
            <Text style={styles.nivelText}>Nivel Fácil</Text>
          </Animatable.View>
          <Animatable.View animation="fadeInUp" delay={800} style={styles.grafico}>
            <Progress.Circle
              size={220}
              progress={nivelMedio}
              showsText={true}
              formatText={() => `${Math.round(nivelMedio * 100)}%`}
              color="#3F51B5"
              borderWidth={3}
              thickness={16}
              unfilledColor="#fff"
              textStyle={{
                fontFamily: 'Comic Sans MS',
                fontWeight: 'bold',
                fontSize: 42,
                color: '#222'
              }}
            />
            <Text style={styles.nivelText}>Nivel Medio</Text>
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    color: '#222',
    marginTop: 10,
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 2,
  },
  descripcion: {
    fontFamily: 'Comic Sans MS',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    marginHorizontal: 10,
  },
  graficosContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    gap: 38,
  },
  grafico: {
    alignItems: 'center',
    marginVertical: 14,
  },
  nivelText: {
    marginTop: 18,
    fontFamily: 'Comic Sans MS',
    fontSize: 28,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
