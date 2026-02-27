// components/Loader.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Flash {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

interface LoaderProps {
  onFinish?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onFinish }) => {
  // Animaciones principales
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;

  // Estados
  const [progressText, setProgressText] = useState<string>('🌌 Iniciando...');
  
  // Referencias para efectos
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number | null>(null);
  const flashEffects = useRef<Flash[]>([]);
  const progressCountRef = useRef<number>(0);

  // Obtener color aleatorio
  const getRandomColor = useCallback((): string => {
    const colors = ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Inicializar partículas
  const initParticles = useCallback((): void => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: getRandomColor(),
      });
    }
    particles.current = newParticles;
  }, [getRandomColor]);

  // Crear destellos
  const createFlash = useCallback((x: number, y: number, size: number): void => {
    const id = Date.now() + Math.random();
    const newFlash: Flash = { id, x, y, size, opacity: 1 };
    
    flashEffects.current = [...flashEffects.current, newFlash];
    
    setTimeout(() => {
      flashEffects.current = flashEffects.current.filter(f => f.id !== id);
    }, 300);
  }, []);

  // Animar partículas
  const animateParticles = useCallback((): void => {
    const updateParticles = () => {
      particles.current = particles.current.map(p => ({
        ...p,
        x: p.x + p.vx * 0.5,
        y: p.y + p.vy * 0.5,
        vx: p.x < 0 || p.x > width ? p.vx * -0.8 : p.vx,
        vy: p.y < 0 || p.y > height ? p.vy * -0.8 : p.vy,
      }));

      animationFrame.current = requestAnimationFrame(updateParticles);
    };

    animationFrame.current = requestAnimationFrame(updateParticles);
  }, []);

  // useEffect para partículas
  useEffect(() => {
    initParticles();
    animateParticles();
    
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [initParticles, animateParticles]);

  // useEffect principal para el loader
  useEffect(() => {
    // Animación del logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
    ]).start();

    // Animación del anillo
    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Simular progreso - AHORA MÁS RÁPIDO (20ms en lugar de 38ms)
    const interval = setInterval(() => {
      progressCountRef.current += 1;
      const count = progressCountRef.current;
      
      // Texto según el progreso
      if (count < 30) {
        setProgressText(`🌌 Iniciando... ${count}%`);
      } else if (count < 50) {
        setProgressText(`🔵 Sintonizando... ${count}%`);
      } else if (count < 70) {
        setProgressText(`💠 Ensamblando... ${count}%`);
      } else if (count < 90) {
        setProgressText(`🌀 Optimizando... ${count}%`);
      } else if (count < 100) {
        setProgressText(`🚀 Cargando... ${count}%`);
      } else {
        setProgressText('✨ ¡Bienvenido/a!');
      }

      // Animar barra de progreso
      Animated.timing(progressWidth, {
        toValue: count,
        duration: 30,
        useNativeDriver: false,
      }).start();

      // Crear destellos aleatorios
      if (Math.random() > 0.7) {
        createFlash(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 30 + 15
        );
      }

      // Cuando llega a 100
      if (count >= 100) {
        clearInterval(interval);
        
        // Destello final
        createFlash(width / 2, height / 2, 150);
        
        // Ocultar loader
        setTimeout(() => {
          Animated.timing(loaderOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            if (onFinish) onFinish();
          });
        }, 400);
      }
    }, 15); 

    return () => clearInterval(interval);
  }, [onFinish, createFlash, logoOpacity, logoScale, ringRotation, progressWidth, loaderOpacity]);

  // Rotación del anillo
  const spin = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: loaderOpacity }]}>
      {/* Fondo */}
      <View style={styles.background} />
      <View style={styles.gradientOverlay} />

      {/* Partículas */}
      <View style={styles.particlesContainer}>
        {particles.current.map((particle, index) => (
          <View
            key={index}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                width: particle.radius * 2,
                height: particle.radius * 2,
                borderRadius: particle.radius,
                backgroundColor: particle.color,
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
      </View>

      {/* Destellos */}
      {flashEffects.current.map((flash) => (
        <View
          key={flash.id}
          style={[
            styles.flash,
            {
              left: flash.x - flash.size / 2,
              top: flash.y - flash.size / 2,
              width: flash.size,
              height: flash.size,
              borderRadius: flash.size / 2,
              opacity: flash.opacity,
            },
          ]}
        />
      ))}

      {/* Logo y anillos */}
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.ringOuter,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ringInner,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Contador */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{progressText}</Text>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a',
    zIndex: 9999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    backgroundColor: 'transparent',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
  },
  flash: {
    position: 'absolute',
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
  },
  logoContainer: {
    position: 'absolute',
    top: height / 2 - 140,
    left: width / 2 - 140,
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  ringInner: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 168,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 200,
    height: 200,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 50,
    left: width / 2 - 130,
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    minWidth: 260,
    alignItems: 'center',
  },
  counterText: {
    color: '#dbeafe',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
});

export default Loader;