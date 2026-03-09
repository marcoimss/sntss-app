import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalculadoraMedianoPlazo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora Crédito Hipotecario</Text>
      <Text style={styles.subtitle}>a Mediano Plazo</Text>
      <Text style={styles.comingSoon}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003c82',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#1B476A',
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#4a6fa5',
    fontStyle: 'italic',
  },
});