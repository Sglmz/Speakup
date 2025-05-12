import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.replace('Inicio');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <Text style={styles.logo}>
        <Text style={styles.s}>S</Text>
        <Text style={styles.p}>P</Text>
        <Text style={styles.e}>E</Text>
        <Text style={styles.a}>A</Text>
        <Text style={styles.k}>K</Text>
        <Text style={styles.u}>U</Text>
        <Text style={styles.p2}>P</Text>
      </Text>

      <Text style={styles.subtitle}>¡Crea tu cuenta con ayuda de tus padres!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.icon}>👤</Text>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#000"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.icon}>✉️</Text>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#000"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔑</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    marginBottom: 10,
  },
  s: { color: '#FF5722' },
  p: { color: '#FF5722' },
  e: { color: '#F44336' },
  a: { color: '#2962FF' },
  k: { color: '#ffffff' },
  u: { color: '#FFAB00' },
  p2: { color: '#FFAB00' },
  subtitle: {
    fontFamily: 'Comic Sans MS',
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '90%',
    elevation: 2,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#3F51B5',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
});
