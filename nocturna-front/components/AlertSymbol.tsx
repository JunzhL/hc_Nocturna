// components/AlertSymbol.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertSymbolProps {
  left: number;
  top: number;
  color: string;
  level: string; // "high" or "medium"
}

export default function AlertSymbol({ left, top, color, level }: AlertSymbolProps) {
  const symbol = level === 'high' ? '🚨' : '⚠️';
  return (
    <View style={[styles.container, { left, top }]}>
      <Text style={[styles.symbol, { color }]}>{symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 20,
  },
});
