import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import { API_URL } from '../config';

export default function UserPanelScreen({ route }) {
  const { username, userId } = route.params;
  const [progresoTotal, setProgresoTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/get_progreso.php?user_id=${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'error') {
          console.warn('⚠️ Respuesta inesperada:', json);
          return;
        }

        // Calcular total general
        let completados = 0, total = 0;
        json.forEach(n => {
          completados += n.completados;
          total += n.total;
        });

        const porcentaje = total ? completados / total : 0;
        setProgresoTotal(porcentaje);
      })
      .catch(err => console.error('❌ Error al obtener progreso:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <View style={s.c}>
      <AnimatedBackground style={StyleSheet.absoluteFillObject} />
      <ScrollView contentContainerStyle={s.s} showsVerticalScrollIndicator={false}>
        <Animatable.Text animation="fadeInDown" delay={200} style={s.t}>
          {username}
        </Animatable.Text>
        <Animatable.Text animation="fadeInDown" delay={400} style={s.d}>
          Bienvenido {username}, este es tu progreso general:
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={600} style={s.g}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF5722" />
          ) : (
            <>
              <Progress.Circle
                size={200}
                progress={progresoTotal}
                showsText
                formatText={() => `${Math.round(progresoTotal * 100)}%`}
                color="#FFAB00"
                borderWidth={3}
                thickness={16}
                unfilledColor="#fff"
                textStyle={s.txt}
              />
              <Text style={s.n}>Progreso Global</Text>
            </>
          )}
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFEB3B' },
  s: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 16 },
  t: {
    fontSize: 36, fontWeight: 'bold', fontFamily: 'Comic Sans MS',
    color: '#222', marginBottom: 18, textAlign: 'center', letterSpacing: 2,
  },
  d: {
    fontFamily: 'Comic Sans MS', fontSize: 18, color: '#333',
    textAlign: 'center', marginBottom: 30,
  },
  g: { alignItems: 'center', marginTop: 12 },
  n: {
    marginTop: 18, fontFamily: 'Comic Sans MS', fontSize: 28,
    color: '#222', fontWeight: 'bold', textAlign: 'center',
  },
  txt: {
    fontFamily: 'Comic Sans MS', fontWeight: 'bold',
    fontSize: 42, color: '#222',
  },
});
