import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FindObjectsTemplate({
  title,
  backgroundImage,
  items = [],           // [{ id, name, icon: require(...), x: '30%', y: '40%' }, ...]
  onComplete = () => {},// callback opcional
}) {
  // ids de los items aún pendientes
  const [remaining, setRemaining] = useState(items.map(i => i.id));
  const [completed, setCompleted] = useState(false);

  const handlePress = id => {
    if (completed) return;
    if (!remaining.includes(id)) return;
    const next = remaining.filter(itemId => itemId !== id);
    setRemaining(next);
    if (next.length === 0) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Lista de nombres */}
      <View style={styles.list}>
        {items.map(item => {
          const done = !remaining.includes(item.id);
          return (
            <Text
              key={item.id}
              style={[styles.itemText, done && styles.crossedText]}
            >
              • {item.name}
            </Text>
          );
        })}
      </View>

      {/* Imagen de fondo con hotspots */}
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {items.map(item => {
            const done = !remaining.includes(item.id);
            return done ? (
              // ✓ verde donde se hizo clic
              <FontAwesome
                key={item.id}
                name="check-circle"
                size={32}
                color="green"
                style={[
                  styles.checkIcon,
                  { left: item.x, top: item.y },
                ]}
              />
            ) : (
              // hotspot clickeable
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePress(item.id)}
                style={[
                  styles.hotspot,
                  { left: item.x, top: item.y },
                ]}
              >
                <Image
                  source={item.icon}
                  style={styles.hotspotImage}
                />
              </TouchableOpacity>
            );
          })}
        </ImageBackground>
      </View>

      {/* Modal de “Excelente” */}
      <Modal visible={completed} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>¡EXCELENTE!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  crossedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: width - 32,
    height: (width - 32) * 1.2,
  },
  hotspot: {
    position: 'absolute',
    width: 48,
    height: 48,
  },
  hotspotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  checkIcon: {
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 8,
  },
  modalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});
