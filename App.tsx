import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import Loader from './components/Loader/Loader'; // Import correcto
import Tarjeta from './components/Tarjeta';
import ScannerScreen from './screens/ScannerScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.circleDecoration} />
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>INICIO</Text>
      </TouchableOpacity>
      <View style={[styles.circleDecoration, styles.bottomCircle]} />
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Loader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circleDecoration: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00a8ff',
    top: -100,
    right: -100,
    opacity: 0.3,
  },
  bottomCircle: {
    top: undefined,
    bottom: -100,
    left: -100,
    right: undefined,
    backgroundColor: '#D4AF37',
    opacity: 0.15,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  button: {
    backgroundColor: '#2a8adeff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});