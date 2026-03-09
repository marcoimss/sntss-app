import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import PanelScreen from './screens/PanelScreen';
import Loader from './components/Loader/Loader';
import ScannerScreen from './screens/ScannerScreen';
import BusquedaScreen from './screens/BusquedaScreen';
import ConfirmacionScreen from './screens/ConfirmacionScreen';
import CalculadoraHipotecario from './screens/CalculadoraHipotecario';
import CalculadoraMedianoPlazo from './screens/CalculadoraMedianoPlazo';
import CalculadoraAguinaldo from './screens/CalculadoraAguinaldo';
import CalculadoraAuto from './screens/CalculadoraAuto';
import Calculadora2Julio from './screens/Calculadora2Julio';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Panel" component={PanelScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Busqueda" component={BusquedaScreen} />
        <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} />
        <Stack.Screen name="CalculadoraHipotecario" component={CalculadoraHipotecario} />
        <Stack.Screen name="CalculadoraMedianoPlazo" component={CalculadoraMedianoPlazo} />
        <Stack.Screen name="CalculadoraAguinaldo" component={CalculadoraAguinaldo} />
        <Stack.Screen name="CalculadoraAuto" component={CalculadoraAuto} />
        <Stack.Screen name="Calculadora2Julio" component={Calculadora2Julio} />
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