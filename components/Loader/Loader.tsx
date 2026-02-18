import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de rotación infinita
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Timer para desaparecer
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Un poco más largo para disfrutar la animación
    
    return () => clearTimeout(timer);
  }, []);

  const rotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.gradient} />

      {/* Partículas estáticas */}
<View style={styles.particles}>
  {[...Array(50)].map((_, i) => (
    <View
      key={i}
      style={[
        styles.particle,
        {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5,
        },
      ]}
    />
  ))}
</View>
      
      {/* Anillos con animación */}
      <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.ring2, { transform: [{ rotate }] }]} />
      
      {/* Logo */}
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Texto de carga */}
      <Text style={styles.text}>CARGANDO...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    opacity: 0.98,
  },

  particles: {
  position: 'absolute',
  width: '100%',
  height: '100%',
},
particle: {
  position: 'absolute',
  width: 2,
  height: 2,
  backgroundColor: '#60a5fa',
  borderRadius: 1,
},
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#3b82f6',
    borderRightColor: '#60a5fa',
    opacity: 0.7,
  },
  ring2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#3b82f6',
    borderLeftColor: '#60a5fa',
    opacity: 0.5,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});

export default Loader;