import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalculadoraAguinaldo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de Aguinaldo</Text>
      <Text style={styles.subtitle}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003c82',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a6fa5',
  },
});