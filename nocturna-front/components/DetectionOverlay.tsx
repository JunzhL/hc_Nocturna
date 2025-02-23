// components/DetectionOverlay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Detection {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface Props {
  detections: Detection[];
}

const dangerousLabels = ['knife', 'gun', 'fire'];
const lessDangerousLabels = ['dog', 'car', 'person'];

export default function DetectionOverlay({ detections }: Props) {
  return (
    <View style={StyleSheet.absoluteFill}>
      {detections.map((det, index) => {
        const labelLower = det.label.toLowerCase();
        let color = 'green';  // default
        if (dangerousLabels.includes(labelLower)) {
          color = 'red';
        } else if (lessDangerousLabels.includes(labelLower)) {
          color = 'yellow';
        }

        return (
          <View key={index} style={styles.item}>
            <Text style={[styles.label, { color }]}>
              {det.label} ({(det.confidence * 100).toFixed(1)}%)
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    padding: 2,
  },
});
