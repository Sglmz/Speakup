import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GameQuestion({
  value,
  type = 'text',
  onPress = () => {},
  isMatched = false,
  isSelected = false,
}) {
  const getCardStyle = () => {
    if (isMatched) return [styles.optionBtn, styles.correct];
    if (isSelected) return [styles.optionBtn, styles.selected];
    return styles.optionBtn;
  };

  const selectedAnimation = isSelected ? 'pulse' : 'bounceIn';

  const getTextColor = () => {
    if (type === 'text' && isMatched) {
      return value.toLowerCase();
    }
    return '#4e342e';
  };

  return (
    <Animatable.View
      animation={selectedAnimation}
      duration={600}
      iterationCount={isSelected ? 'infinite' : 1}
      style={{ width: '48%' }}
    >
      <TouchableOpacity
        style={[
          getCardStyle(),
          type === 'color' && { backgroundColor: value },
          isSelected && styles.scaleUp,
        ]}
        onPress={onPress}
        disabled={isMatched}
        activeOpacity={0.85}
      >
        {type === 'text' && (
          <Text style={[styles.optionText, { color: getTextColor() }]}>
            {value}
          </Text>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  optionBtn: {
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 25,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#FFD54F',
    transform: [{ scale: 1 }],
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
  },
  correct: {
    backgroundColor: 'rgba(182, 252, 213, 0.95)',
    shadowColor: '#13c26e',
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  selected: {
    backgroundColor: '#ffe082',
    borderWidth: 2,
    borderColor: '#FFB300',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  scaleUp: {
    transform: [{ scale: 1.08 }],
  },
});
