import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import PanelScreen from './screens/PanelScreen';
import Loader from './components/Loader/Loader'; 
import Tarjeta from './components/Tarjeta';
import ScannerScreen from './screens/ScannerScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.circleDecoration1} />
      <View style={styles.circleDecoration2} />
      <View style={styles.circleDecoration3} />
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.mainTitle}>SNTSS</Text>
      <Text style={styles.welcomeSubtitle}>Bienvenido a la plataforma sindical</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Sindicato Nacional de Trabajadores del Seguro Social</Text>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader onFinish={handleLoaderFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Panel" component={PanelScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circleDecoration1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#003c82',
    top: -150,
    right: -150,
    opacity: 0.08,
  },
  circleDecoration2: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#00a8ff',
    bottom: -120,
    left: -120,
    opacity: 0.08,
  },
  circleDecoration3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1B476A',
    bottom: 100,
    right: -80,
    opacity: 0.05,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    shadowColor: '#003c82',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#003c82',
    marginBottom: 8,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 60, 130, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4a6fa5',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#003c82',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 40,
    shadowColor: '#003c82',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#00a8ff',
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    color: '#8A9BB5',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
});