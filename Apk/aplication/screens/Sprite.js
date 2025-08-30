// components/Sprite.js
import React from 'react';
import { Image, Text } from 'react-native';

// Sprite.js (en la raíz)
const IMAGES = {
  numbers: {
    apple:  require('../assets/sprites/words/apple.png'),
    star:   require('../assets/sprites/words/star.png'),
    ball:   require('../assets/sprites/words/ball.png'),
  },
  words: {
    table:  require('../assets/sprites/words/table.png'),
    chair:  require('../assets/sprites/words/chair.png'),
    door:   require('../assets/sprites/words/door.png'),
    window: require('../assets/sprites/words/window.png'),
    garden: require('../assets/sprites/words/garden.png'),
  },
};
const EMOJI = {
  numbers: { apple:'🍎', star:'⭐', ball:'⚽' },
  words:   { table:'🍽️', chair:'🪑', door:'🚪', window:'🪟', garden:'🌳' },
};

export default function Sprite({ group='numbers', name, size=64, style }) {
  const src = IMAGES[group]?.[name];
  if (!src) {
    const emoji = EMOJI[group]?.[name] ?? '❔';
    return <Text style={[{ fontSize: size }, style]}>{emoji}</Text>;
  }
  return <Image source={src} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}
