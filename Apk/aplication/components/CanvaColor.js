import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Image as SvgImage, Mask, Rect, G } from 'react-native-svg';
import { PanResponder } from 'react-native';

// SketchCanvas con máscara para borrar trazos sin pintar de blanco
export default function SketchCanvas({ promptText, imageSource, width, height, toolSize = 5, eraserSize = 15 }) {
  const [strokes, setStrokes] = useState([]);        // trazos normales
  const [maskPaths, setMaskPaths] = useState([]);    // trazos de borrador (mask)
  const [currentColor] = useState('#FF0000');
  const [drawingWidth] = useState(toolSize);
  const [isEraser, setIsEraser] = useState(false);
  const pan = useRef({ points: [] }).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        pan.points = [e.nativeEvent.locationX, e.nativeEvent.locationY];
        if (isEraser) {
          setMaskPaths(prev => [...prev, { width: eraserSize, points: pan.points.slice() }]);
        } else {
          setStrokes(prev => [...prev, { color: currentColor, width: drawingWidth, points: pan.points.slice() }]);
        }
      },
      onPanResponderMove: e => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        pan.points.push(x, y);
        if (isEraser) {
          setMaskPaths(prev => {
            const u = [...prev];
            u[u.length - 1] = { ...u[u.length - 1], points: pan.points.slice() };
            return u;
          });
        } else {
          setStrokes(prev => {
            const u = [...prev];
            u[u.length - 1] = { ...u[u.length - 1], points: pan.points.slice() };
            return u;
          });
        }
      },
      onPanResponderRelease: () => { pan.points = []; }
    })
  ).current;

  const clearAll = () => {
    setStrokes([]);
    setMaskPaths([]);
  };
  const toggleEraser = () => setIsEraser(e => !e);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{promptText}</Text>
      <View style={{ width, height }} {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          {/* Imagen de fondo */}
          <SvgImage
            x={0} y={0}
            width={width} height={height}
            preserveAspectRatio="xMidYMid slice"
            href={imageSource}
          />

          {/* Máscara: blanco = muestra, negro = oculta trazos */}
          <Mask id="eraserMask">
            <Rect x={0} y={0} width={width} height={height} fill="white" />
            {maskPaths.map((m, i) => (
              <Path
                key={i}
                d={`M ${m.points.join(' L ')}`}
                stroke="black"
                strokeWidth={m.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Mask>

          {/* Grupo de trazos aplicado con máscara */}
          <G mask="url(#eraserMask)">
            {strokes.map((s, i) => (
              <Path
                key={i}
                d={`M ${s.points.join(' L ')}`}
                stroke={s.color}
                strokeWidth={s.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </G>
        </Svg>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={clearAll} style={styles.button}>
          <Text>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleEraser} style={styles.button}>
          <Text>{isEraser ? 'Pincel' : 'Borrador'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 16 },
  prompt: { fontSize: 18, marginBottom: 12, fontWeight: 'bold' },
  controls: { flexDirection: 'row', marginTop: 12 },
  button: { backgroundColor: '#EEE', padding: 10, marginHorizontal: 8, borderRadius: 6 }
});
